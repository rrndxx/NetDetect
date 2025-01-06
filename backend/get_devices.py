import nmap
import socket
import subprocess
import platform
from concurrent.futures import ThreadPoolExecutor
import uuid
import re


def get_local_ip_range():
    """Retrieve the local network IP range."""
    try:
        local_ip = socket.gethostbyname(socket.gethostname())
        ip_parts = local_ip.split(".")[:3]
        return f"{'.'.join(ip_parts)}.0/24"
    except Exception as e:
        print(f"Error retrieving local IP range: {e}")
        return "192.168.1.0/24"


def populate_arp(ip_range):
    """Ping devices in the IP range to populate the ARP table."""
    print("Populating ARP cache...")
    try:
        if platform.system() == "Windows":
            for i in range(1, 255):
                subprocess.run(
                    f"ping -n 1 {ip_range.split('/')[0]}{i}",
                    shell=True,
                    stdout=subprocess.PIPE,
                )
        else:
            subprocess.run(f"nmap -sn {ip_range}", shell=True, stdout=subprocess.PIPE)
    except Exception as e:
        print(f"Error populating ARP cache: {e}")


def get_mac_from_arp(ip_address):
    """Retrieve the MAC address for an IP address from the ARP table."""
    try:
        command = "arp -a" if platform.system() == "Windows" else f"arp -n {ip_address}"
        output = subprocess.check_output(command, shell=True, universal_newlines=True)
        for line in output.splitlines():
            if ip_address in line:
                mac = re.findall(r"(([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})", line)
                return mac[0][0] if mac else "N/A"
    except subprocess.CalledProcessError:
        return "N/A"
    return "N/A"


def retry_arp_for_missing_mac(ip_address):
    """Retry ARP request for a specific IP to fetch its MAC address."""
    print(f"Retrying ARP for IP: {ip_address}")
    try:
        ping_command = (
            f"ping -n 1 {ip_address}"
            if platform.system() == "Windows"
            else f"ping -c 1 {ip_address}"
        )
        subprocess.run(ping_command, shell=True, stdout=subprocess.PIPE)
        return get_mac_from_arp(ip_address)
    except Exception as e:
        print(f"Retry ARP failed for {ip_address}: {e}")
        return "N/A"


def get_hostname(ip_address):
    """Get the hostname for an IP address."""
    try:
        return socket.gethostbyaddr(ip_address)[0]
    except (socket.herror, socket.gaierror):
        return "Unknown"


def get_host_mac():
    """Retrieve the MAC address of the host device."""
    try:
        mac = uuid.getnode()
        return ":".join(f"{(mac >> ele) & 0xff:02x}" for ele in range(40, -1, -8))
    except Exception as e:
        print(f"Failed to retrieve host MAC: {e}")
        return "N/A"


def parse_device_type_and_model(nm, ip_address):
    """Parse device type and model information based on Nmap scan results."""
    os_name = "Unknown"
    vendor_name = "Unknown"
    device_type = "Unknown Device"
    model_info = "Unknown Model"

    if ip_address not in nm.all_hosts():
        return os_name, vendor_name, device_type, model_info

    # Parse OS matches
    os_matches = nm[ip_address].get("osmatch", [])
    os_classes = nm[ip_address].get("osclass", [])
    for match in os_matches:
        os_name = match.get("name", "Unknown")
        if "android" in os_name.lower():
            return os_name, vendor_name, "Mobile Device", "Android"
        if "ios" in os_name.lower() or "iphone" in os_name.lower():
            return os_name, vendor_name, "Mobile Device", "iOS"
        if "windows" in os_name.lower():
            return os_name, vendor_name, "Desktop/Laptop", "Windows"
        if "linux" in os_name.lower():
            return os_name, vendor_name, "Desktop/Laptop", "Linux"

    # Use OS class information if available
    for os_class in os_classes:
        if os_class.get("type") in ["phone", "tablet"]:
            return os_name, os_class.get("vendor", "Unknown"), "Mobile Device", os_name
        if os_class.get("type") == "computer":
            return os_name, os_class.get("vendor", "Unknown"), "Desktop/Laptop", os_name

    # Use vendor information from MAC or Nmap
    vendor_info = nm[ip_address].get("vendor", {})
    if vendor_info:
        vendor_name = list(vendor_info.values())[0]

    return os_name, vendor_name, device_type, model_info


def get_device_os(nm, ip_address):
    """Get the operating system name from Nmap results if available."""
    try:
        if ip_address not in nm.all_hosts():
            return "Unknown OS"

        os_matches = nm[ip_address].get("osmatch", [])
        if os_matches:
            return os_matches[0].get("name", "Unknown OS")

        return "Unknown OS"
    except Exception as e:
        print(f"Error detecting OS for {ip_address}: {e}")
        return "Unknown OS"


def scan_host(ip_address):
    """Scan a single host and retrieve information."""
    nm = nmap.PortScanner()

    if ip_address == socket.gethostbyname(socket.gethostname()):
        return {
            "hostname": socket.gethostname(),
            "ip_address": ip_address,
            "mac_address": get_host_mac(),
            "device_type": "Host Device",
            "device_model": "Host Model",
            "os": platform.system(),
        }

    try:
        print(f"Scanning host: {ip_address}")
        nm.scan(ip_address, arguments="-A -T4 -O --osscan-guess")
    except Exception as e:
        print(f"Scan failed for {ip_address}: {e}")
        return {
            "hostname": "N/A",
            "ip_address": ip_address,
            "mac_address": "N/A",
            "device_type": "N/A",
            "device_model": "N/A",
            "os": "N/A",
        }

    hostname = get_hostname(ip_address)
    mac_address = nm[ip_address]["addresses"].get("mac", "N/A")
    if mac_address == "N/A":
        mac_address = retry_arp_for_missing_mac(ip_address)

    os_name, vendor_name, device_type, model_info = parse_device_type_and_model(
        nm, ip_address
    )
    device_os = get_device_os(nm, ip_address)

    return {
        "hostname": hostname,
        "ip_address": ip_address,
        "mac_address": mac_address,
        "device_type": device_type,
        "device_model": model_info,
        "os": device_os,
    }


def scan_network(ip_range):
    """Scan the network and gather information about all devices."""
    populate_arp(ip_range)
    print(f"Scanning network: {ip_range}")

    nm = nmap.PortScanner()
    try:
        nm.scan(hosts=ip_range, arguments="-T4 -O --osscan-guess")
    except Exception as e:
        print(f"Network scan failed: {e}")
        return []

    devices = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(scan_host, host): host for host in nm.all_hosts()}
        for future in futures:
            try:
                devices.append(future.result())
            except Exception as e:
                print(f"Error scanning {futures[future]}: {e}")

    return devices

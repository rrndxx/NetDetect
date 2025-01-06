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


def parse_device_type(nm, ip_address):
    """Improved device type parsing based on Nmap scan results."""
    device_type = "Unknown Device"

    if ip_address not in nm.all_hosts():
        return device_type

    # Look at OS match results
    os_matches = nm[ip_address].get("osmatch", [])
    os_classes = nm[ip_address].get("osclass", [])

    for match in os_matches:
        os_name = match.get("name", "").lower()
        if "android" in os_name:
            return "Mobile Device"
        if "ios" in os_name or "iphone" in os_name:
            return "Mobile Device"
        if "windows" in os_name:
            return "Windows Laptop/Desktop"
        if "linux" in os_name:
            return "Linux Laptop/Desktop"
        if "mac" in os_name:
            return "MacOS Laptop/Desktop"

    for os_class in os_classes:
        if os_class.get("type") in ["phone", "tablet"]:
            return "Mobile Device"
        if os_class.get("type") == "computer":
            return "Laptop/Desktop"

    # Further check the MAC address vendor for some devices like printers, routers, etc.
    mac_address = nm[ip_address].get("addresses", {}).get("mac", "")
    if mac_address:
        vendor = get_vendor_from_mac(mac_address)
        if vendor:
            if "apple" in vendor.lower():
                return "MacOS Laptop/Desktop"
            if "samsung" in vendor.lower() or "xiaomi" in vendor.lower():
                return "Mobile Device"
            if "dell" in vendor.lower() or "hp" in vendor.lower():
                return "Windows Laptop/Desktop"
            if "lenovo" in vendor.lower():
                return "Windows Laptop/Desktop"

    return device_type


def get_vendor_from_mac(mac_address):
    """Return the vendor name based on the MAC address (using a simple prefix lookup)."""
    # Example of known MAC address prefixes for vendors (could be expanded)
    mac_vendor_prefixes = {
        "00:14:22": "HP",
        "00:1A:2B": "Dell",
        "00:21:5D": "Apple",
        "B4:E6:2D": "Lenovo",
        "00:19:66": "Samsung",
        "00:1A:11": "Xiaomi",
    }
    mac_prefix = ":".join(mac_address.split(":")[:3]).upper()
    return mac_vendor_prefixes.get(mac_prefix, None)


def get_device_os(nm, ip_address):
    """Enhanced OS detection with more fallbacks."""
    try:
        if ip_address not in nm.all_hosts():
            return "Unknown OS"

        os_matches = nm[ip_address].get("osmatch", [])
        if os_matches:
            return os_matches[0].get("name", "Unknown OS")

        # Additional fallback: check open ports to deduce the OS (more complex)
        open_ports = nm[ip_address].get("tcp", {}).keys()
        if 22 in open_ports:
            return "Linux/Unix (SSH)"
        if 3389 in open_ports:
            return "Windows (RDP)"
        if 80 in open_ports:
            return "HTTP (Web Server)"

        return "Unknown OS"
    except Exception as e:
        print(f"Error detecting OS for {ip_address}: {e}")
        return "Unknown OS"


def scan_host(ip_address):
    """Scan a single host and retrieve information, including device type."""
    nm = nmap.PortScanner()

    if ip_address == socket.gethostbyname(socket.gethostname()):
        return {
            "hostname": socket.gethostname(),
            "ip_address": ip_address,
            "mac_address": get_host_mac(),
            "device_type": "Host Device",
            "os": platform.system(),
        }

    try:
        print(f"Scanning host: {ip_address}")
        nm.scan(ip_address, arguments="-A -T4 -O --osscan-guess --osscan-limit")
    except Exception as e:
        print(f"Scan failed for {ip_address}: {e}")
        return {
            "hostname": "N/A",
            "ip_address": ip_address,
            "mac_address": "N/A",
            "device_type": "N/A",
            "os": "N/A",
        }

    hostname = get_hostname(ip_address)
    mac_address = nm[ip_address]["addresses"].get("mac", "N/A")
    if mac_address == "N/A":
        mac_address = retry_arp_for_missing_mac(ip_address)

    # Use the improved device type parsing function
    device_type = parse_device_type(nm, ip_address)

    # Retrieve the device's operating system
    device_os = get_device_os(nm, ip_address)

    return {
        "hostname": hostname,
        "ip_address": ip_address,
        "mac_address": mac_address,
        "device_type": device_type,
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

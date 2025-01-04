import nmap
import socket
import subprocess
import platform
from concurrent.futures import ThreadPoolExecutor
import uuid


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
            subprocess.run(
                f"ping -n 1 {ip_range.split('/')[0]}",
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
                return line.split()[1 if platform.system() == "Windows" else 2]
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


def get_device_type(nm, ip_address):
    """Identify the device type based on Nmap scan results and additional checks."""
    try:
        # Check if the IP address is in Nmap results
        if ip_address in nm.all_hosts():
            # Check for OS match first
            if "osmatch" in nm[ip_address]:
                os_matches = nm[ip_address]["osmatch"]
                if os_matches and isinstance(os_matches, list):
                    for match in os_matches:
                        os_name = match.get("name", "").lower()
                        # Match known operating systems and categorize devices
                        if "android" in os_name:
                            return "Android Phone"
                        if "ios" in os_name or "iphone" in os_name:
                            return "iPhone"
                        if "mac" in os_name:
                            return "MacOS"
                        if "windows" in os_name:
                            return "Windows PC"
                        if "linux" in os_name:
                            return "Linux Machine"
                        if "raspbian" in os_name or "raspberry pi" in os_name:
                            return "Raspberry Pi"
                        if "freebsd" in os_name:
                            return "FreeBSD Server"

            # Vendor-based device detection
            if "vendor" in nm[ip_address]:
                vendor = list(nm[ip_address]["vendor"].values())
                if vendor:
                    vendor_name = vendor[0].lower()
                    # Detect specific device vendors based on known fingerprints
                    if "apple" in vendor_name:
                        return "Apple Device"
                    if "samsung" in vendor_name:
                        return "Samsung Device"
                    if "huawei" in vendor_name:
                        return "Huawei Device"
                    if "sony" in vendor_name:
                        return "Sony Device"
                    if (
                        "dell" in vendor_name
                        or "hp" in vendor_name
                        or "lenovo" in vendor_name
                    ):
                        return "Laptop/Desktop"
                    if "xiaomi" in vendor_name:
                        return "Xiaomi Device"
                    if "linksys" in vendor_name or "netgear" in vendor_name:
                        return "Network Device"
                    if "xiaomi" in vendor_name:
                        return "Xiaomi Device"
                    if "amazon" in vendor_name:
                        return "Amazon Device (e.g., Echo)"

            # Open ports can help identify device types
            open_ports = nm[ip_address].get("tcp", {})
            if open_ports:
                if 22 in open_ports:
                    return "Linux Machine / IoT Device (SSH)"
                if 3389 in open_ports:
                    return "Windows PC (RDP)"
                if 80 in open_ports or 443 in open_ports:
                    return "Web Server / IoT Device"

            # If no definitive match, return unknown device
            return "Unknown Device"
    except KeyError as e:
        print(f"Missing key in Nmap data for {ip_address}: {e}")
    except Exception as e:
        print(f"Error detecting device type for {ip_address}: {e}")
    return "Unknown Device"


def get_device_model(nm, ip_address):
    """Get device model from Nmap results if available."""
    try:
        if ip_address in nm.all_hosts():
            if "osmatch" in nm[ip_address]:
                os_matches = nm[ip_address]["osmatch"]
                if os_matches and isinstance(os_matches, list):
                    for match in os_matches:
                        if "model" in match.get("name", "").lower():
                            return match.get("name")
            if "vendor" in nm[ip_address]:
                vendor = list(nm[ip_address]["vendor"].values())
                if vendor:
                    return f"{vendor[0]}"
    except KeyError as e:
        print(f"Missing key in Nmap data for {ip_address}: {e}")
    except Exception as e:
        print(f"Error detecting device model for {ip_address}: {e}")
    return "Unknown Model"


def scan_host(ip_address):
    """Scan a single host and retrieve information."""
    nm = nmap.PortScanner()

    if ip_address == socket.gethostbyname(socket.gethostname()):
        mac_address = get_host_mac()
        hostname = socket.gethostname()
        return {
            "hostname": hostname,
            "ip_address": ip_address,
            "mac_address": mac_address,
            "device_type": "Host Device",
            "device_model": "Host Model",
            "os": platform.system(),  # Get the OS of the host system
        }

    try:
        print(f"Scanning host: {ip_address}")
        nm.scan(
            ip_address,
            arguments="-A -T4 --max-retries 3 --host-timeout 120s -Pn -O --osscan-guess",
        )
    except Exception as e:
        print(f"Scan failed for {ip_address}: {e}")
        return {
            "hostname": "N/A",
            "ip_address": ip_address,
            "mac_address": "N/A",
            "device_type": "N/A",
            "device_model": "N/A",
            "os": "N/A",  # No OS info if the scan fails
        }

    hostname = get_hostname(ip_address)
    mac_address = nm[ip_address]["addresses"].get("mac", "N/A")
    if mac_address == "N/A":
        mac_address = retry_arp_for_missing_mac(ip_address)

    device_type = get_device_type(nm, ip_address)
    device_model = get_device_model(nm, ip_address)
    device_os = "Unknown OS"  # Default in case OS is not available

    # If OS information is available in the scan, update device_os
    if "osmatch" in nm[ip_address]:
        os_matches = nm[ip_address]["osmatch"]
        if os_matches:
            device_os = os_matches[0].get("name", "Unknown OS")

    return {
        "hostname": hostname,
        "ip_address": ip_address,
        "mac_address": mac_address,
        "device_type": device_type,
        "device_model": device_model,
        "os": device_os,  # Include OS in the response
    }


def retry_scan_for_missing_devices(hosts, existing_devices):
    """Retry scanning for devices that might be missing."""
    scanned_ips = {device["ip_address"] for device in existing_devices}
    missing_ips = [ip for ip in hosts if ip not in scanned_ips]

    if missing_ips:
        print("Retrying scan for missing devices...")
        return [scan_host(ip) for ip in missing_ips]
    return []


def scan_network(ip_range):
    """Scan the network and gather information about all devices."""
    populate_arp(ip_range)
    print(f"Scanning network: {ip_range}")

    nm = nmap.PortScanner()
    try:
        nm.scan(
            hosts=ip_range,
            arguments="-Pn -T4 --max-retries 3 --host-timeout 120s -p 80,443 -O --osscan-guess",
        )
    except Exception as e:
        print(f"Network scan failed: {e}")
        return []

    hosts = nm.all_hosts()
    devices = []

    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = {executor.submit(scan_host, host): host for host in hosts}
        for future in futures:
            try:
                devices.append(future.result())
            except Exception as e:
                print(f"Error scanning {futures[future]}: {e}")
    
    devices += retry_scan_for_missing_devices(hosts, devices)

    return devices

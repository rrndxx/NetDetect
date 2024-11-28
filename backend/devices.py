import nmap
import socket
import subprocess
import platform
from concurrent.futures import ThreadPoolExecutor
import uuid


def get_local_ip_range():
    """Get the local network IP range."""
    local_ip = socket.gethostbyname(socket.gethostname())
    ip_parts = local_ip.split(".")[:3]
    return f"{'.'.join(ip_parts)}.0/24"


def populate_arp(ip_range):
    """Ping devices in the entire range to populate ARP table."""
    print("Populating ARP cache...")
    try:
        if platform.system() == "Windows":
            subprocess.run(f"ping -n 1 {ip_range.split('/')[0]}", shell=True, stdout=subprocess.PIPE)
        else:
            subprocess.run(f"nmap -sn {ip_range}", shell=True, stdout=subprocess.PIPE)
    except Exception as e:
        print(f"Error populating ARP cache: {e}")


def get_mac_from_arp(ip_address):
    """Retrieve the MAC address from the ARP table."""
    try:
        if platform.system() == "Windows":
            output = subprocess.check_output(f"arp -a {ip_address}", shell=True, universal_newlines=True)
            for line in output.splitlines():
                if ip_address in line:
                    return line.split()[1]
        else:
            output = subprocess.check_output(f"arp -n {ip_address}", shell=True, universal_newlines=True)
            for line in output.splitlines():
                if ip_address in line:
                    return line.split()[2]
    except subprocess.CalledProcessError:
        return "N/A"
    return "N/A"


def retry_arp_for_missing_mac(ip_address):
    """Retry ARP request for a single IP to fetch its MAC address."""
    try:
        print(f"Retrying ARP for IP: {ip_address}")
        if platform.system() == "Windows":
            subprocess.run(f"ping -n 1 {ip_address}", shell=True, stdout=subprocess.PIPE)
        else:
            subprocess.run(f"ping -c 1 {ip_address}", shell=True, stdout=subprocess.PIPE)

        # Check ARP table again
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
        return ':'.join(f"{(mac >> ele) & 0xff:02x}" for ele in range(40, -1, -8))
    except Exception as e:
        print(f"Failed to retrieve host MAC: {e}")
        return "N/A"


def get_device_type(nm, ip_address):
    """Attempt to identify the device type based on Nmap scan."""
    try:
        if ip_address in nm.all_hosts():
            if "osclass" in nm[ip_address]:
                return nm[ip_address]["osclass"][0].get("osfamily", "Unknown")
            if "hostnames" in nm[ip_address]:
                return "Device Detected"
    except Exception:
        pass
    return "Unknown"


def scan_host(ip_address):
    """Scan a single host and retrieve information."""
    nm = nmap.PortScanner()

    # Special handling for the host device
    if ip_address == socket.gethostbyname(socket.gethostname()):
        print(f"Detecting details for the host device ({ip_address})...")
        mac_address = get_host_mac()
        hostname = socket.gethostname()
        return {
            "hostname": hostname,
            "ip_address": ip_address,
            "mac_address": mac_address,
            "device_type": "Host Device",
        }

    try:
        # Perform a detailed scan of the host
        nm.scan(ip_address, arguments="-A -T4 --max-retries 1")
    except Exception as e:
        print(f"Scan failed for {ip_address}: {e}")
        return {
            "hostname": "N/A",
            "ip_address": ip_address,
            "mac_address": "N/A",
            "device_type": "N/A",
        }

    # Fetch hostname
    hostname = get_hostname(ip_address)

    # Get MAC address
    mac_address = nm[ip_address]["addresses"].get("mac", "N/A")
    if mac_address == "N/A":  # Retry if MAC is still missing
        mac_address = retry_arp_for_missing_mac(ip_address)

    # Get device type
    device_type = get_device_type(nm, ip_address)

    return {
        "hostname": hostname,
        "ip_address": ip_address,
        "mac_address": mac_address,
        "device_type": device_type,
    }


def scan_network(ip_range):
    """Scan the network using Nmap with parallel host scanning."""
    populate_arp(ip_range)
    print(f"Scanning network: {ip_range}")

    # Initialize the scanner and get host IPs
    nm = nmap.PortScanner()
    try:
        nm.scan(hosts=ip_range, arguments="-sn -T4")
    except Exception as e:
        print(f"Network scan failed: {e}")
        return []

    hosts = nm.all_hosts()

    # Use threading to scan hosts concurrently
    devices = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(scan_host, host) for host in hosts]
        for future in futures:
            devices.append(future.result())

    return devices


def display_devices(devices):
    """Display the scanned devices."""
    print(f"{'Hostname':<30} {'IP Address':<20} {'MAC Address':<20} {'Device Type':<15}")
    print("=" * 90)
    for device in devices:
        hostname = device.get("hostname", "N/A")
        ip_address = device.get("ip_address", "N/A")
        mac_address = device.get("mac_address", "N/A")
        device_type = device.get("device_type", "N/A")
        print(f"{hostname:<30} {ip_address:<20} {mac_address:<20} {device_type:<15}")


def main():
    ip_range = get_local_ip_range()
    devices = scan_network(ip_range)
    display_devices(devices)


if __name__ == "__main__":
    main()

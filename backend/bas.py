import socket
import nmap
from scapy.all import ARP, Ether, srp
from pysnmp.hlapi import *

def get_local_network():
    """Retrieve the local IP address and determine the network range."""
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    network = ".".join(local_ip.split(".")[:-1]) + ".0/24"
    return network

def scan_arp(network):
    """Perform ARP scan to find devices on the network."""
    print("[*] Scanning network for devices using ARP...")
    arp_request = ARP(pdst=network)
    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request
    answered_list = srp(arp_request_broadcast, timeout=2, verbose=False)[0]

    devices = []
    for sent, received in answered_list:
        devices.append({"ip": received.psrc, "mac": received.hwsrc, "hostname": None})
    return devices

def nmap_scan(network):
    """Use Nmap to perform a network scan and retrieve hostnames, device types, and operating systems."""
    print("[*] Running Nmap scan for detailed information...")
    nm = nmap.PortScanner()
    nm.scan(
        hosts=network, arguments="-O -sV"
    )  # -O enables OS detection, -sV for service version detection

    hosts = []
    for host in nm.all_hosts():
        hostname = nm[host].hostname() if nm[host].hostname() else None

        # Handle cases where Nmap is unable to detect the OS
        os_name = nm[host].get("osmatch", [{"name": "Unknown"}])[0]["name"]

        # Handle device type using vendor information from Nmap
        device_type = nm[host].get("vendor", {}).get("Device Type", "Unknown")

        hosts.append(
            {
                "ip": host,
                "hostname": hostname,
                "os": os_name,
                "device_type": device_type,
            }
        )

    return hosts

def snmp_scan(ip):
    """Query an SNMP-enabled device to gather information."""
    iterator = getCmd(
        SnmpEngine(),
        CommunityData("public"),
        UdpTransportTarget((ip, 161)),
        ContextData(),
        ObjectType(ObjectIdentity("1.3.6.1.2.1.1.1.0")),
    )  # sysDescr OID
    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)
    if errorIndication:
        print(f"SNMP error for {ip}: {errorIndication}")
        return None
    return f"Device Info: {varBinds[0].prettyPrint()}"

def resolve_hostname(ip):
    """Try to resolve the hostname using reverse DNS lookup."""
    try:
        hostname, _, _ = socket.gethostbyaddr(ip)
        return hostname
    except (socket.herror, socket.gaierror):
        return "Unknown"

def merge_results(arp_results, nmap_results):
    """
    Merge ARP and Nmap scan results.
    This will combine information like IP, MAC address, hostname, OS, and device type.
    """
    merged_devices = []

    # Create a dictionary for fast lookup by IP
    nmap_dict = {result["ip"]: result for result in nmap_results}

    for device in arp_results:
        ip = device["ip"]
        mac = device["mac"]
        # Try to resolve hostname if Nmap doesn't provide it
        if device["hostname"] is None:
            device["hostname"] = resolve_hostname(ip)

        # Find corresponding Nmap result by IP, if available
        if ip in nmap_dict:
            nmap_info = nmap_dict[ip]
            device.update(
                {
                    "hostname": nmap_info["hostname"],
                    "os": nmap_info["os"],
                    "device_type": nmap_info["device_type"],
                }
            )
        else:
            device.update(
                {"hostname": "Unknown", "os": "Unknown", "device_type": "Unknown"}
            )
        merged_devices.append(device)

    # Add any devices from Nmap that weren't found in ARP results
    for nmap_info in nmap_results:
        if not any(device["ip"] == nmap_info["ip"] for device in merged_devices):
            merged_devices.append(nmap_info)

    return merged_devices

def display_results(devices):
    """Display the merged device scan results."""
    print("\n[*] Network Scan Results:")
    print(f"{'IP Address':<20} {'MAC Address':<20} {'Hostname':<30} {'OS':<20} {'Device Type':<20}")
    print("="*110)  # Separator line
    for device in devices:
        ip = device.get("ip", "N/A")
        mac = device.get("mac", "N/A")
        hostname = device.get("hostname", "N/A")
        os = device.get("os", "N/A")
        device_type = device.get("device_type", "N/A")
        print(f"{ip:<20} {mac:<20} {hostname:<30} {os:<20} {device_type:<20}")

def main():
    network = get_local_network()
    print(f"[*] Scanning network: {network}")

    # Step 1: ARP Scan
    arp_results = scan_arp(network)

    # Step 2: Nmap Scan
    nmap_results = nmap_scan(network)

    # Step 3: Merge Results
    devices = merge_results(arp_results, nmap_results)

    # Step 4: Display Results
    display_results(devices)

if __name__ == "__main__":
    main()

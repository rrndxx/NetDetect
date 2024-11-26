import scapy.all as scapy
import psutil
import socket
import time
import concurrent.futures


# Function to perform ARP request and discover a single device
def get_device_info(ip):
    """
    Send ARP request to discover a device by IP and retrieve its MAC and hostname
    :param ip: The IP address of the device to scan
    :return: A dictionary containing device info (IP, MAC, hostname)
    """
    arp_request = scapy.ARP(pdst=ip)
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request
    answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]

    if answered_list:
        ip = answered_list[0][1].psrc
        mac = answered_list[0][1].hwsrc
        hostname = get_hostname(ip)
        return {"ip": ip, "mac": mac, "hostname": hostname}
    return None


# Function to get hostname of a device from IP
def get_hostname(ip):
    try:
        hostname = socket.gethostbyaddr(ip)[0]
    except socket.herror:
        hostname = "Unknown"
    return hostname


# Function to get the total bandwidth usage (in Mbps) for a device
def get_bandwidth_usage(interface="eth0"):
    net_io = psutil.net_io_counters(pernic=True)
    if interface in net_io:
        bytes_sent = net_io[interface].bytes_sent
        bytes_recv = net_io[interface].bytes_recv
        time.sleep(1)  # Wait for 1 second to get accurate stats

        net_io = psutil.net_io_counters(pernic=True)
        bytes_sent_new = net_io[interface].bytes_sent
        bytes_recv_new = net_io[interface].bytes_recv

        # Calculate the total Mbps sent and received in the last second
        sent_mbps = (bytes_sent_new - bytes_sent) * 8 / 1_000_000  # in Mbps
        recv_mbps = (bytes_recv_new - bytes_recv) * 8 / 1_000_000  # in Mbps
        return sent_mbps + recv_mbps
    return 0


# Function to scan the network using parallelism for multiple IPs
def scan_network(ip_range):
    devices = []
    # Split the IP range into individual IPs and scan them in parallel
    ip_list = [
        f"{ip_range}.{i}" for i in range(1, 255)
    ]  # Assuming you are scanning a /24 range

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(get_device_info, ip_list)
        for result in results:
            if result:
                devices.append(result)

    return devices


# Function to monitor devices' bandwidth usage in parallel
def monitor_bandwidth(devices, interface="Ethernet 2"):
    device_bandwidth = []

    # Use ThreadPoolExecutor to monitor bandwidth of all devices concurrently
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_device = {
            executor.submit(get_bandwidth_usage, interface): device
            for device in devices
        }

        for future in concurrent.futures.as_completed(future_to_device):
            device = future_to_device[future]
            bandwidth = future.result()
            device_bandwidth.append(
                {
                    "hostname": device["hostname"],
                    "ip": device["ip"],
                    "mac": device["mac"],
                    "bandwidth": bandwidth,
                }
            )

    return device_bandwidth


# Main function to continuously display devices and their bandwidth consumption
def monitor_network(ip_range="192.168.3", interface="Ethernet 2"):
    try:
        while True:
            print(f"\nScanning network: {ip_range}...\n")
            devices = scan_network(ip_range)

            # Monitor bandwidth usage for all devices in parallel
            device_bandwidth = monitor_bandwidth(devices, interface)

            print(
                f"{'Hostname':<30} {'IP Address':<20} {'MAC Address':<20} {'Bandwidth (Mbps)':<20}"
            )
            print("=" * 90)

            # Print device info with bandwidth usage
            for device in device_bandwidth:
                print(
                    f"{device['hostname']:<30} {device['ip']:<20} {device['mac']:<20} {device['bandwidth']:<20.2f}"
                )

            print("\nWaiting for the next scan...")
            time.sleep(5)  # Wait 5 seconds before the next scan to avoid overload
    except KeyboardInterrupt:
        print("\nNetwork monitoring stopped by user.")


if __name__ == "__main__":
    # Example: Continuously monitor the network 192.168.1.1/24 and monitor 'eth0' interface
    monitor_network(ip_range="192.168.3", interface="Ethernet 2")

import socket
import subprocess
import threading
import re

devices = []


def ping_device(ip):
    try:
        response = subprocess.run(
            ["ping", "-n", "1", "-w", "3000", ip], capture_output=True, text=True
        )
        if "Reply from" in response.stdout:
            hostname = resolve_hostname(ip)
            mac_address = get_mac_from_arp(ip)
            devices.append({"ip": ip, "hostname": hostname, "mac": mac_address})
    except Exception as e:
        print(f"Error pinging {ip}: {e}")


def resolve_hostname(ip):
    try:
        return socket.gethostbyaddr(ip)[0]
    except socket.herror:
        return "Unknown"


def get_mac_from_arp(ip):
    try:
        arp_table = subprocess.run("arp -a", capture_output=True, text=True, shell=True)
        match = re.search(rf"({ip})\s+([\w-]+)\s+([\w:.-]+)", arp_table.stdout)
        return match.group(3) if match else "Unknown"
    except Exception as e:
        return "Unknown"


def scan_network(network_prefix):
    threads = []
    for i in range(1, 255):
        ip = f"{network_prefix}.{i}"
        thread = threading.Thread(target=ping_device, args=(ip,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()


def print_devices():
    if devices:
        print(f"{'IP Address':<20}{'Hostname':<30}{'MAC Address':<20}")
        print("-" * 70)
        for device in devices:
            print(f"{device['ip']:<20}{device['hostname']:<30}{device['mac']:<20}")
    else:
        print("No devices found.")


def get_network_prefix():
    try:
        result = subprocess.run("ipconfig", capture_output=True, text=True, shell=True)
        ip_pattern = r"IPv4 Address.*?: (\d+\.\d+\.\d+)\.\d+"
        match = re.search(ip_pattern, result.stdout)
        return match.group(1) if match else None
    except Exception as e:
        print(f"Error getting network prefix: {e}")
        return None


def main():
    network_prefix = get_network_prefix()
    if network_prefix:
        print(f"Scanning network: {network_prefix}.0/24")
        scan_network(network_prefix)
        print_devices()
    else:
        print("Unable to scan network.")


if __name__ == "__main__":
    main()

import asyncio
import socket
import platform
import uuid
import nmap

DEVICE_TYPE_MAPPINGS = {
    "apple": "Apple Device",
    "samsung": "Samsung Device",
    "dell": "Laptop/Desktop",
    "hp": "Laptop/Desktop",
    "lenovo": "Laptop/Desktop",
    "microsoft": "Laptop/Desktop",
    "cisco": "Network Device",
    "tp-link": "Router/Switch",
    "ubiquiti": "Router/Switch",
    "asus": "Laptop/Desktop",
    "nvidia": "Game Console",
    "playstation": "Game Console",
    "xbox": "Game Console",
    "roku": "Media Streaming Device",
    "google": "Smart Device",
    "amazon": "Smart Device",
    "ring": "IoT Device (Smart Doorbell)",
    "nest": "IoT Device (Thermostat/Camera)",
    "lg": "Smart TV",
    "sony": "Smart TV",
    "tcl": "Smart TV",
    "bose": "Smart Speaker",
    "sonos": "Smart Speaker",
    "xiaomi": "Smart Device",
    "oppo": "Smartphone",
    "huawei": "Smartphone",
    "oneplus": "Smartphone",
}

async def get_local_ip_range():
    try:
        local_ip = socket.gethostbyname(socket.gethostname())
        ip_parts = local_ip.split(".")[:3]
        return f"{'.'.join(ip_parts)}.0/24"
    except Exception as e:
        print(f"Error retrieving local IP range: {e}")
        return "192.168.1.0/24"


async def populate_arp(ip_range):
    print("Populating ARP cache...")
    try:
        if platform.system() == "Windows":
            await asyncio.create_subprocess_shell(
                f"ping -n 1 {ip_range.split('/')[0]}", stdout=asyncio.subprocess.PIPE
            )
        else:
            await asyncio.create_subprocess_shell(
                f"nmap -sn {ip_range}", stdout=asyncio.subprocess.PIPE
            )
    except Exception as e:
        print(f"Error populating ARP cache: {e}")


async def get_mac_from_arp(ip_address):
    try:
        command = "arp -a" if platform.system() == "Windows" else f"arp -n {ip_address}"
        process = await asyncio.create_subprocess_shell(
            command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, _ = await process.communicate()
        output = stdout.decode()
        for line in output.splitlines():
            if ip_address in line:
                return line.split()[1 if platform.system() == "Windows" else 2]
    except Exception as e:
        print(f"Error getting MAC from ARP for {ip_address}: {e}")
    return "N/A"


async def retry_arp_for_missing_mac(ip_address):
    print(f"Retrying ARP for IP: {ip_address}")
    try:
        ping_command = (
            f"ping -n 1 {ip_address}"
            if platform.system() == "Windows"
            else f"ping -c 1 {ip_address}"
        )
        await asyncio.create_subprocess_shell(
            ping_command, stdout=asyncio.subprocess.PIPE
        )
        return await get_mac_from_arp(ip_address)
    except Exception as e:
        print(f"Retry ARP failed for {ip_address}: {e}")
        return "N/A"


async def get_hostname(ip_address):
    try:
        return socket.gethostbyaddr(ip_address)[0]
    except (socket.herror, socket.gaierror):
        return "Unknown"


def get_host_mac():
    try:
        mac = uuid.getnode()
        return ":".join(f"{(mac >> ele) & 0xff:02x}" for ele in range(40, -1, -8))
    except Exception as e:
        print(f"Failed to retrieve host MAC: {e}")
        return "N/A"


async def get_device_type_and_os(nm, ip_address):
    try:
        device_type = "Unknown"
        os_detected = "Unknown"

        if ip_address in nm.all_hosts():
            if "osclass" in nm[ip_address]:
                os_classes = nm[ip_address]["osclass"]
                if os_classes:
                    os_family = os_classes[0].get("osfamily", "Unknown")
                    os_gen = os_classes[0].get("osgen", "")
                    os_detected = f"{os_family} {os_gen}".strip()

            if "osmatch" in nm[ip_address]:
                os_matches = nm[ip_address]["osmatch"]
                if os_matches:
                    os_detected = os_matches[0].get("name", "Unknown")

        return device_type, os_detected
    except Exception as e:
        print(f"Error detecting device type and OS for {ip_address}: {e}")
        return "Unknown", "Unknown"


async def scan_host(ip_address):
    nm = nmap.PortScanner()

    if ip_address == socket.gethostbyname(socket.gethostname()):
        mac_address = get_host_mac()
        hostname = socket.gethostname()
        return {
            "hostname": hostname,
            "ip_address": ip_address,
            "mac_address": mac_address,
            "device_type": "Host Device",
            "os": platform.system()
        }

    try:
        print(f"Scanning host: {ip_address}")
        nm.scan(ip_address, arguments="-A -T4 --max-retries 3 --host-timeout 120s -Pn")
    except Exception as e:
        print(f"Scan failed for {ip_address}: {e}")
        return {
            "hostname": "N/A",
            "ip_address": ip_address,
            "mac_address": "N/A",
            "device_type": "N/A",
            "os": "N/A"
        }

    hostname = await get_hostname(ip_address)
    mac_address = nm[ip_address]["addresses"].get("mac", "N/A")
    if mac_address == "N/A":
        mac_address = await retry_arp_for_missing_mac(ip_address)
    device_type, os_detected = await get_device_type_and_os(nm, ip_address)

    return {
        "hostname": hostname,
        "ip_address": ip_address,
        "mac_address": mac_address,
        "device_type": device_type,
        "os": os_detected
    }


async def retry_scan_for_missing_devices(hosts, existing_devices):
    scanned_ips = {device["ip_address"] for device in existing_devices}
    missing_ips = [ip for ip in hosts if ip not in scanned_ips]

    if missing_ips:
        print("Retrying scan for missing devices...")
        return await asyncio.gather(*[scan_host(ip) for ip in missing_ips])
    return []


async def scan_network(ip_range):
    await populate_arp(ip_range)
    print(f"Scanning network: {ip_range}")

    nm = nmap.PortScanner()
    try:
        nm.scan(hosts=ip_range, arguments="-Pn -T4 --max-retries 3 --host-timeout 120s -p 80,443")
    except Exception as e:
        print(f"Network scan failed: {e}")
        return []

    hosts = nm.all_hosts()
    devices = await asyncio.gather(*[scan_host(host) for host in hosts])
    missing_devices = await retry_scan_for_missing_devices(hosts, devices)
    devices.extend(missing_devices)

    return devices


async def main():
    ip_range = await get_local_ip_range()
    devices = await scan_network(ip_range)
    for device in devices:
        print(device)


if __name__ == "__main__":
    asyncio.run(main())

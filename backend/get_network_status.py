import speedtest
import psutil
import socket
import requests
import os


def _run_speedtest():
    """Run a speed test to measure download/upload speeds and ping."""
    try:
        st = speedtest.Speedtest()
        st.get_best_server()

        download_speed = st.download() / 1_000_000
        upload_speed = st.upload() / 1_000_000
        ping = st.results.ping

        return {
            "Download Speed (Mbps)": round(download_speed, 2),
            "Upload Speed (Mbps)": round(upload_speed, 2),
            "Ping (ms)": ping,
        }
    except Exception as e:
        print(f"Error running speed test: {e}")
        return {
            "Download Speed (Mbps)": "N/A",
            "Upload Speed (Mbps)": "N/A",
            "Ping (ms)": "N/A",
        }


def _get_network_info():
    """Retrieve network info, including local IP, external IP, router, and DNS servers."""
    network_info = {}

    # Fetching local IP
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        network_info["Hostname"] = hostname
        network_info["Local IP"] = local_ip
    except Exception as e:
        print(f"Error fetching local IP: {e}")
        network_info["Local IP"] = "N/A"

    # Fetching MAC addresses and IPv4 addresses from network interfaces
    try:
        for interface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == socket.AF_INET:  # IPv4 address
                    network_info[f"IPv4 Address ({interface})"] = addr.address
                elif addr.family == psutil.AF_LINK:  # MAC Address
                    network_info[f"MAC Address ({interface})"] = addr.address
    except Exception as e:
        print(f"Error fetching interface addresses: {e}")

    # Fetching external IP
    try:
        external_ip = requests.get("https://api.ipify.org", timeout=5).text
        network_info["External IP"] = external_ip
    except requests.RequestException as e:
        print(f"Error fetching external IP: {e}")
        network_info["External IP"] = "Unable to fetch"

    # Fetching router IP (default gateway)
    try:
        gateways = psutil.net_if_stats()
        default_gateway = psutil.net_if_stats()
        for interface, status in psutil.net_if_stats().items():
            if status.isup and interface != "lo":  # Skip loopback
                gateway_ip = (
                    os.popen(f"ip r | grep default | awk '{{print $3}}'").read().strip()
                )
                if gateway_ip:
                    network_info["Router IP"] = gateway_ip
                    break
    except Exception as e:
        print(f"Error fetching router IP: {e}")
        network_info["Router IP"] = "N/A"

    # Fetch DNS servers
    try:
        resolv_conf_path = "/etc/resolv.conf" if os.name != "nt" else "N/A"
        dns_servers = []
        if os.path.exists(resolv_conf_path):
            with open(resolv_conf_path, "r") as f:
                dns_servers = [
                    line.split()[1] for line in f if line.startswith("nameserver")
                ]
        else:
            # On Windows, we'll use a placeholder for now
            dns_servers = ["DNS fetching for Windows not implemented"]

        network_info["DNS Servers"] = dns_servers
    except Exception as e:
        print(f"Error fetching DNS servers: {e}")
        network_info["DNS Servers"] = "N/A"

    return network_info


if __name__ == "__main__":
    # Run and display speed test results
    speedtest_results = _run_speedtest()
    print("\n=== Speed Test Results ===")
    for key, value in speedtest_results.items():
        print(f"{key}: {value}")

    # Fetch and display network info
    network_info = _get_network_info()
    print("\n=== Network Information ===")
    for key, value in network_info.items():
        print(f"{key}: {value}")

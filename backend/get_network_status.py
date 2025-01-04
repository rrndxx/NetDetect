import speedtest
import psutil
import socket
import requests


def _run_speedtest():
    """Run a speedtest to measure download/upload speeds and ping."""
    st = speedtest.Speedtest()

    st.get_best_server()

    download_speed = st.download() / 1_000_000  # Convert from bits/s to Mbit/s
    upload_speed = st.upload() / 1_000_000  # Convert from bits/s to Mbit/s
    ping = st.results.ping

    return download_speed, upload_speed, ping


def _get_network_info():
    """Retrieve network info, including local IP, external IP, router, and DNS servers."""
    network_info = {}

    # Fetching local and external IP
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)

    for interface, addrs in psutil.net_if_addrs().items():
        for addr in addrs:
            if addr.family == socket.AF_INET:  # IPv4 address
                network_info["Local IP"] = addr.address
            elif addr.family == psutil.AF_LINK:  # MAC Address
                network_info["MAC Address"] = addr.address

    try:
        external_ip = requests.get("https://api.ipify.org").text
    except requests.RequestException:
        external_ip = "Unable to fetch external IP"

    # Fetching the router's IP (default gateway)
    gateway = psutil.net_if_addrs()
    for interface, addrs in psutil.net_if_stats().items():
        if interface == "lo":  # Skipping loopback interface
            continue
        try:
            gateway_ip = psutil.net_if_stats()[interface].default_gateway
            if gateway_ip:
                network_info["Router IP"] = gateway_ip
        except Exception as e:
            print(f"Error fetching gateway info: {e}")

    # Fetch DNS servers (if configured)
    dns_servers = psutil.net_if_addrs()
    try:
        dns_info = psutil.net_if_addrs()["DNS"]  # Access DNS setting through psutil
        network_info["DNS Servers"] = dns_info
    except Exception as e:
        print(f"Error fetching DNS info: {e}")

    # Add network info
    network_info["Local IP"] = local_ip
    network_info["External IP"] = external_ip

    return network_info

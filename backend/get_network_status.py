import speedtest
import psutil
import socket
import requests

def _run_speedtest():
    st = speedtest.Speedtest()
    
    st.get_best_server()
    
    download_speed = st.download() / 1_000_000  
    upload_speed = st.upload() / 1_000_000  
    ping = st.results.ping
    
    return download_speed, upload_speed, ping

def _get_network_info():
    network_info = {}
    
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    
    for interface, addrs in psutil.net_if_addrs().items():
        for addr in addrs:
            if addr.family == socket.AF_INET:  
                network_info['IP'] = addr.address
            elif addr.family == psutil.AF_LINK:
                network_info['MAC Address'] = addr.address
    
    try:
        external_ip = requests.get("https://api.ipify.org").text
    except requests.RequestException:
        external_ip = "Unable to fetch external IP"
    
    network_info['Local IP'] = local_ip
    network_info['External IP'] = external_ip
    
    return network_info
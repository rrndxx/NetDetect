import scapy.all as scapy
import threading
import psutil
import socket
import time
from scapy.layers.inet import IP

def detect_network():
    interfaces = psutil.net_if_addrs()
    for iface, addr_list in interfaces.items():
        for addr in addr_list:
            if addr.family == socket.AF_INET:  
                if not addr.address.startswith("127."):
                    print(f"Detected active network interface: {iface}, IP: {addr.address}")
                    return iface, addr.address  
    return None, None 

bandwidth_usage = {}

def process_packet(packet):
    if packet.haslayer(IP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        packet_size = len(packet)

        if ip_src.startswith("192.168.") and ip_dst.startswith("192.168."):
            if ip_src not in bandwidth_usage:
                bandwidth_usage[ip_src] = {'sent': 0, 'received': 0}
            if ip_dst not in bandwidth_usage:
                bandwidth_usage[ip_dst] = {'sent': 0, 'received': 0}
            
            bandwidth_usage[ip_src]['sent'] += packet_size
            bandwidth_usage[ip_dst]['received'] += packet_size

def sniff_packets(interface):
    print(f"Sniffing on interface: {interface}")
    scapy.sniff(prn=process_packet, store=0, filter="ip", iface=interface)

def monitor_bandwidth():
    while True:
        total_sent = 0
        total_received = 0

        print("\n--- Current Bandwidth Usage (Last 5 Seconds) ---")
        print(f"{'IP Address':<15} | {'Sent (Mbps)':<12} | {'Received (Mbps)'}")
        print("=" * 50)
        
        for ip, usage in bandwidth_usage.items():
            sent_mbps = (usage['sent'] * 8) / 1_000_000  
            received_mbps = (usage['received'] * 8) / 1_000_000  
            
            total_sent += usage['sent']
            total_received += usage['received']
            
            print(f"{ip:<15} | {sent_mbps:<12.2f} | {received_mbps:<14.2f}")
        
        total_sent_mbps = (total_sent * 8) / 1_000_000
        total_received_mbps = (total_received * 8) / 1_000_000
        print("=" * 50)
        print(f"{'Total':<15} | {total_sent_mbps:<12.2f} | {total_received_mbps:<14.2f}")
        
        time.sleep(5)

if __name__ == "__main__":
    interface, ip_address = detect_network()
    if interface is None or ip_address is None:
        print("No active local network detected.")
    else:
        print(f"Active interface: {interface}, IP: {ip_address}")
        
        sniff_thread = threading.Thread(target=sniff_packets, args=(interface,), daemon=True)
        sniff_thread.start()
        
        monitor_bandwidth()

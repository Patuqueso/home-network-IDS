from scapy.all import *
from collections import defaultdict
import time


def nids_rules(packet):
    if packet.haslayer(TCP):
        tcp_src_port = packet[TCP].sport
        tcp_dst_port = packet[TCP].dport
        if tcp_dst_port == 6660:  # Example: Detect traffic to suspicious port
            print(f"[NIDS ALERT] Potential malware traffic to port {tcp_dst_port} from {packet[IP].src}")

# DDoS detection variables
ip_counts = defaultdict(int)
total_packet_count = 0
IP_THRESHOLD = 100  # Per IP threshold
TOTAL_THRESHOLD = 1000  # Overall traffic threshold

# Function to process each packet
def process_packet(packet):
    global total_packet_count

    # Simple print to check if packets are being captured
    print(f"Captured packet: {packet.summary()}")

    # NIDS processing
    nids_rules(packet)

    # DDoS detection logic
    if packet.haslayer(IP):
        ip_src = packet[IP].src
        
        # Ignore traffic from the TV's IP (10.0.0.18)
        if ip_src == "10.0.0.18":
            return  # Skip further processing for this packet

        ip_counts[ip_src] += 1
        total_packet_count += 1

        if ip_counts[ip_src] > IP_THRESHOLD:
            print(f"[WARNING] High traffic from IP: {ip_src} ({ip_counts[ip_src]} packets)")

        if total_packet_count > TOTAL_THRESHOLD:
            print(f"[ALERT] Possible DDoS detected! {total_packet_count} packets captured.")
            print("IPs involved in the attack:")
            for ip, count in ip_counts.items():
                if count > 10:
                    print(f"  {ip}: {count} packets")
            total_packet_count = 0

# Start sniffing network traffic
print("Starting packet capture...")
sniff(iface="enp0s3", prn=process_packet, store=False)

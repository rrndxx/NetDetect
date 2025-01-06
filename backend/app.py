from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread, Lock
import time
import speedtest
import psutil
import socket
import requests
import asyncio
from get_devices import scan_network, get_local_ip_range
from get_network_status import _run_speedtest, _get_network_info

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Global variables and locks
devices_list = []
network_status_data = {}
devices_list_lock = Lock()

last_received = 0
last_sent = 0
total_received = 0
total_sent = 0
bandwidth_usage_data = {}
bandwidth_usage_lock = Lock()


# Speedtest function
async def run_speedtest():
    return await asyncio.to_thread(_run_speedtest)


def _run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        download_speed = st.download() / 1_000_000  # Convert to Mbps
        upload_speed = st.upload() / 1_000_000  # Convert to Mbps
        ping = st.results.ping
        return download_speed, upload_speed, ping
    except Exception as e:
        print(f"Speedtest error: {e}")
        return None, None, None


# Network information function
async def get_network_info():
    return await asyncio.to_thread(_get_network_info)


def _get_network_info():
    network_info = {}
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)

        for interface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == socket.AF_INET:
                    network_info["IP"] = addr.address
                elif hasattr(psutil, "AF_LINK") and addr.family == psutil.AF_LINK:
                    network_info["MAC Address"] = addr.address

        external_ip = requests.get("https://api.ipify.org", timeout=5).text
        network_info["Local IP"] = local_ip
        network_info["External IP"] = external_ip

        gateways = psutil.net_if_addrs().get("eth0", [])
        if gateways:
            for addr in gateways:
                if addr.family == socket.AF_INET:
                    network_info["Router IP"] = addr.address
                    break

    except Exception as e:
        print(f"Error fetching network info: {e}")

    return network_info


# Bandwidth tracking function
def track_bandwidth_usage():
    global last_received, last_sent, total_received, total_sent

    # Initialize bandwidth data with dummy values
    global bandwidth_usage_data
    bandwidth_usage_data = {
        "download_usage": 0.0,
        "upload_usage": 0.0,
        "total_download_usage": 0.0,
        "total_upload_usage": 0.0,
    }

    while True:
        with bandwidth_usage_lock:
            net_io = psutil.net_io_counters()
            bytes_received = net_io.bytes_recv
            bytes_sent = net_io.bytes_sent

            download_usage = (
                bytes_received - last_received
            ) / 1_000_000  # Convert to MB/s
            upload_usage = (bytes_sent - last_sent) / 1_000_000  # Convert to MB/s

            total_received += download_usage
            total_sent += upload_usage

            last_received = bytes_received
            last_sent = bytes_sent

            bandwidth_usage_data = {
                "download_usage": download_usage,
                "upload_usage": upload_usage,
                "total_download_usage": total_received,
                "total_upload_usage": total_sent,
            }

        time.sleep(1)


# Network status fetch function
async def fetch_network_status():
    download_speed, upload_speed, ping = await run_speedtest()
    network_info = await get_network_info()

    global bandwidth_usage_data
    return {
        "status": "success",
        "download_speed": download_speed,
        "upload_speed": upload_speed,
        "ping": ping,
        "network_info": network_info,
        "bandwidth_usage": bandwidth_usage_data,
    }


# Continuous network status update
async def continuous_network_status():
    while True:
        try:
            global network_status_data
            network_status_data = await fetch_network_status()
        except Exception as e:
            print(f"Error during network status update: {e}")
        await asyncio.sleep(3)


# Helper for starting asyncio loop
def start_asyncio_loop(loop, coro):
    asyncio.set_event_loop(loop)
    loop.run_until_complete(coro)


# Flask endpoints
@app.route("/api/network-status", methods=["GET"])
def get_network_status():
    try:
        if not network_status_data:
            return (
                jsonify(
                    {
                        "status": "loading",
                        "message": "Network status is still loading, please try again in a few seconds.",
                        "download_speed": None,
                        "upload_speed": None,
                        "ping": None,
                        "network_info": {
                            "Local IP": None,
                            "External IP": None,
                            "MAC Address": None,
                            "IP": None,
                            "Router IP": None,
                        },
                        "bandwidth_usage": {
                            "download_usage": None,
                            "upload_usage": None,
                            "total_download_usage": None,
                            "total_upload_usage": None,
                        },
                    }
                ),
                200,
            )
        return jsonify(network_status_data), 200
    except Exception as e:
        print(f"Error while fetching network status: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/bandwidth-usage", methods=["GET"])
def get_bandwidth_usage():
    try:
        # Ensure that the bandwidth usage data is initialized properly
        with bandwidth_usage_lock:
            if not bandwidth_usage_data:
                return (
                    jsonify(
                        {
                            "status": "loading",
                            "message": "Bandwidth usage is still being calculated. Please try again shortly.",
                            "download_usage": None,
                            "upload_usage": None,
                            "total_download_usage": None,
                            "total_upload_usage": None,
                        }
                    ),
                    200,
                )
            return jsonify({"status": "success", **bandwidth_usage_data}), 200
    except Exception as e:
        print(f"Error fetching bandwidth usage: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/devices", methods=["GET"])
def get_devices():
    try:
        with devices_list_lock:
            devices = devices_list.copy()
        return jsonify({"status": "success", "devices": devices}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


def continuous_scan():
    print("Starting continuous scan thread...")
    while True:
        try:
            ip_range = get_local_ip_range()
            devices = scan_network(ip_range)
            global devices_list
            with devices_list_lock:
                devices_list = devices
        except Exception as e:
            print(f"Error during scan: {e}")
        time.sleep(60)


# Main function
if __name__ == "__main__":
    # Start background threads
    scan_thread = Thread(target=continuous_scan)
    scan_thread.daemon = True
    scan_thread.start()

    network_loop = asyncio.new_event_loop()
    network_status_thread = Thread(
        target=start_asyncio_loop, args=(network_loop, continuous_network_status())
    )
    network_status_thread.daemon = True
    network_status_thread.start()

    bandwidth_thread = Thread(target=track_bandwidth_usage)
    bandwidth_thread.daemon = True
    bandwidth_thread.start()

    # Start Flask app
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False)

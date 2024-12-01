import requests
import os
from bs4 import BeautifulSoup

# Function to detect the router's IP address automatically (for Windows)
def get_router_ip():
    try:
        # Run 'ipconfig' command to get the network details
        ipconfig_output = os.popen("ipconfig").read()
        
        # Look for the default gateway in the output
        gateway_line = None
        for line in ipconfig_output.splitlines():
            if "Default Gateway" in line:
                gateway_line = line
                break
        
        # Extract the gateway IP (assuming the gateway line contains the IP)
        if gateway_line:
            parts = gateway_line.split(":")
            router_ip = parts[1].strip()  # The IP address comes after the colon
            return router_ip
        else:
            print("Default Gateway not found.")
            return None
    except Exception as e:
        print(f"Error detecting router IP: {e}")
        return None

# Function to authenticate to the router and get the HTML content (or API response)
def login_to_router(router_ip, username, password):
    # Construct the URL for the router's login page or API endpoint
    login_url = f'http://{router_ip}/login'
    
    # Create a session to maintain the login state
    session = requests.Session()
    
    # Prepare the login payload (assuming the router expects form data)
    login_data = {
        'username': username,
        'password': password
    }
    
    # Send a POST request to login
    response = session.post(login_url, data=login_data)
    
    # Check if login was successful (based on the router's response)
    if response.status_code == 200 and "Welcome" in response.text:
        return session
    else:
        print("Failed to log in!")
        return None

# Function to scrape the connected devices from the router
def get_connected_devices(session, router_ip):
    # API or page that lists connected devices (this will depend on your router)
    devices_url = f'http://{router_ip}/devices'
    
    # Send a request to the router to fetch the connected devices page
    response = session.get(devices_url)
    
    if response.status_code == 200:
        # Parse the response with BeautifulSoup if it's HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract the devices information (assuming the devices are in a table or list)
        devices_info = []
        rows = soup.find_all('tr')  # Assume each device is in a table row
        for row in rows:
            columns = row.find_all('td')
            if len(columns) >= 5:
                # Assuming the columns contain: Hostname, IP, MAC, Device Type, OS
                hostname = columns[0].text.strip()
                ip_address = columns[1].text.strip()
                mac_address = columns[2].text.strip()
                device_type = columns[3].text.strip()
                operating_system = columns[4].text.strip()
                
                devices_info.append({
                    'hostname': hostname,
                    'ip_address': ip_address,
                    'mac_address': mac_address,
                    'device_type': device_type,
                    'operating_system': operating_system
                })
        return devices_info
    else:
        print("Failed to fetch connected devices data.")
        return None

# Main function
def main():
    # Detect the router's IP address automatically
    router_ip = get_router_ip()
    if not router_ip:
        print("Could not detect router IP address.")
        return
    
    print(f"Router IP detected: {router_ip}")
    
    # Login credentials for your router (change these as needed)
    username = "admin"
    password = "admin"
    
    # Log in to the router
    session = login_to_router(router_ip, username, password)
    if not session:
        return
    
    # Get connected devices info
    devices = get_connected_devices(session, router_ip)
    if devices:
        # Print the connected devices' info
        for device in devices:
            print(f"Hostname: {device['hostname']}")
            print(f"IP Address: {device['ip_address']}")
            print(f"MAC Address: {device['mac_address']}")
            print(f"Device Type: {device['device_type']}")
            print(f"Operating System: {device['operating_system']}")
            print("-" * 50)

if __name__ == "__main__":
    main()

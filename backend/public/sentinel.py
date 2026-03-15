import requests
import json
import os
import platform
import socket
import time
import sys

CONFIG_FILE = os.path.expanduser("~/.guardian_switch.json")
DEFAULT_URL = "https://guardian-switch.vercel.app/api/pulse"

def get_config():
    if not os.path.exists(CONFIG_FILE):
        print(f"Error: Config file not found at {CONFIG_FILE}")
        print("Please create it with: {\"api_key\": \"YOUR_KEY\", \"url\": \"YOUR_URL\"}")
        sys.exit(1)
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def send_pulse():
    config = get_config()
    api_key = config.get("api_key")
    url = config.get("url", DEFAULT_URL)
    
    payload = {
        "api_key": api_key,
        "device": {
            "name": socket.gethostname(),
            "os": platform.system(),
            "os_version": platform.version(),
            "type": "laptop"
        },
        "timestamp": int(time.time())
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print(f"Successfully checked in at {time.ctime()}")
        else:
            print(f"Failed to check in. Server returned: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error sending pulse: {e}")

if __name__ == "__main__":
    # Wait a few seconds for Wi-Fi to stabilize if triggered immediately on wake
    time.sleep(5)
    send_pulse()

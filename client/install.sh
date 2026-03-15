#!/bin/bash

# GuardianSwitch Linux Installer
# This script sets up the sentinel to run on boot and network connect.

CLIENT_DIR="/home/tim/.gemini/antigravity/scratch/guardian-switch/client"
SENTINEL_PATH="$CLIENT_DIR/sentinel.py"
SERVICE_NAME="guardian-sentinel"
SYSTEMD_DIR="$HOME/.config/systemd/user"

echo "🔧 Setting up GuardianSwitch Sentinel for Linux..."

# 1. Create systemd user directory if it doesn't exist
mkdir -p "$SYSTEMD_DIR"

# 2. Create the systemd service file
cat <<EOF > "$SYSTEMD_DIR/$SERVICE_NAME.service"
[Unit]
Description=GuardianSwitch Sentinel Client
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/python3 $SENTINEL_PATH
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=default.target
EOF

# 3. Create a timer to run it every hour as well
cat <<EOF > "$SYSTEMD_DIR/$SERVICE_NAME.timer"
[Unit]
Description=Run GuardianSwitch Sentinel hourly

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
Unit=$SERVICE_NAME.service

[Install]
WantedBy=timers.target
EOF

# 4. Reload systemd and enable service
systemctl --user daemon-reload
systemctl --user enable "$SERVICE_NAME.timer"
systemctl --user start "$SERVICE_NAME.timer"

echo "✅ GuardianSwitch Sentinel installed and scheduled (Hourly + On Boot)."
echo "⚠️  Remember to create ~/.guardian_switch.json with your API key."

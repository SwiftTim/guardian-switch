import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const apiKey = req.nextUrl.searchParams.get('key') || '$1'; // $1 is from the bash piping

    const script = `#!/bin/bash

# GuardianSwitch Linux Installer
# This script sets up a background sentinel service

API_KEY="${apiKey}"
if [ "$API_KEY" == "$1" ]; then
    API_KEY="$1"
fi

if [ -z "$API_KEY" ] || [ "$API_KEY" == "undefined" ]; then
    echo "Error: API Key is required."
    exit 1
fi

echo "🔧 Setting up GuardianSwitch Sentinel..."

# Fix variables
SENTINEL_DIR="$HOME/.guardian-switch"
mkdir -p "$SENTINEL_DIR"

# Create config
cat <<EOF > "$HOME/.guardian_switch.json"
{
  "api_key": "$API_KEY",
  "url": "https://guardian-switch.vercel.app/api/pulse"
}
EOF

# Download sentinel script if it doesn't exist
curl -sSL https://guardian-switch.vercel.app/sentinel.py -o "$SENTINEL_DIR/sentinel.py"

# Setup Systemd Timer
mkdir -p "$HOME/.config/systemd/user/"

cat <<EOF > "$HOME/.config/systemd/user/guardian-sentinel.service"
[Unit]
Description=GuardianSwitch Sentinel Heartbeat
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/bin/python3 $SENTINEL_DIR/sentinel.py
EOF

cat <<EOF > "$HOME/.config/systemd/user/guardian-sentinel.timer"
[Unit]
Description=Run GuardianSwitch Sentinel hourly

[Timer]
OnBootSec=2min
OnUnitActiveSec=1h

[Install]
WantedBy=timers.target
EOF

# Reload and enable
systemctl --user daemon-reload
systemctl --user enable --now guardian-sentinel.timer

echo "✅ GuardianSwitch Sentinel installed and active."
`;

    return new NextResponse(script, {
        headers: {
            'Content-Type': 'text/x-shellscript',
        },
    });
}

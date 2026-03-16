import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const host = req.headers.get('host') || 'guardian-switch-jf1r.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const script = `
function install-sentinel {
    param([string]$key)
    
    if (-not $key) {
        Write-Error "API Key is required. Usage: install-sentinel -key 'YOUR_KEY'"
        return
    }

    Write-Host "🔧 Setting up GuardianSwitch Sentinel for Windows..." -ForegroundColor Cyan

    $configPath = "$HOME\\.guardian_switch.json"
    $sentinelDir = "$HOME\\.guardian-switch"
    if (-not (Test-Path $sentinelDir)) { New-Item -ItemType Directory -Path $sentinelDir }

    # Create config
    $config = @{
        api_key = $key
        url = "${baseUrl}/api/pulse"
    }
    $config | ConvertTo-Json | Out-File $configPath -Encoding utf8

    # Download script
    Invoke-WebRequest -Uri "${baseUrl}/sentinel.py" -OutFile "$sentinelDir\\sentinel.py"

    # Create Scheduled Task (Hourly)
    $action = New-ScheduledTaskAction -Execute 'python' -Argument "$sentinelDir\\sentinel.py"
    $trigger = New-ScheduledTaskTrigger -AtLogOn -RepetitionInterval (New-TimeSpan -Hours 1)
    $principal = New-ScheduledTaskPrincipal -UserId (Get-CimInstance –ClassName Win32_ComputerSystem).UserName -LogonType Interactive
    
    Register-ScheduledTask -TaskName "GuardianSwitch_Sentinel" -Action $action -Trigger $trigger -Principal $principal -Force

    # Run immediately for first pulse
    Write-Host "🚀 Sending initial heartbeat..." -ForegroundColor Yellow
    python "$sentinelDir\\sentinel.py"

    Write-Host "✅ GuardianSwitch Sentinel installed and scheduled hourly." -ForegroundColor Green
}
`;

    return new NextResponse(script, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}

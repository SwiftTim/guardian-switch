# GuardianSwitch Windows Installer
# Run this in PowerShell as Administrator

$ClientDir = "$HOME\.gemini\antigravity\scratch\guardian-switch\client"
$SentinelPath = "$ClientDir\sentinel.py"
$TaskName = "GuardianSwitchSentinel"

Write-Host "🔧 Setting up GuardianSwitch Sentinel for Windows..." -ForegroundColor Cyan

# 1. Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python not found in PATH. Please install Python and try again."
    exit
}

# 2. Define the Action (Run Python script)
$Action = New-ScheduledTaskAction -Execute "python.exe" -Argument "`"$SentinelPath`""

# 3. Define the Triggers (At Logon and At Unlock)
$TriggerLogon = New-ScheduledTaskTrigger -AtLogon
$TriggerUnlock = New-ScheduledTaskTrigger -AtWindowStationUnlock

# 4. Define Settings
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 5. Register the Task
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $TriggerLogon, $TriggerUnlock -Settings $Settings -Description "Runs GuardianSwitch sentinel to check in with the server." -Force

Write-Host "✅ GuardianSwitch Sentinel installed." -ForegroundColor Green
Write-Host "The task will run every time you log in or unlock your computer."
Write-Host "⚠️ Remember to create ~/.guardian_switch.json in your home folder."

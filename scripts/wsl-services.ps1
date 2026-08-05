# ═══════════════════════════════════════════════════════════════
# FloodWatch AI — WSL2 Service Manager (Windows PowerShell)
# Replaces Docker Desktop with native WSL2 services
# ═══════════════════════════════════════════════════════════════
param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "status", "setup", "logs")]
    [string]$Action = "status"
)

$WslScriptDir = "$env:USERPROFILE\.floodwatch"

function Invoke-Wsl {
    param([string]$Command)
    wsl -e bash -c $Command
}

switch ($Action) {
    "setup" {
        Write-Host "[floodwatch] Running WSL2 setup..." -ForegroundColor Cyan
        $setupScript = Join-Path $PSScriptRoot "wsl-setup.sh"
        wsl -e bash -c "bash '$($setupScript.Replace('\','/'))'"
    }
    "start" {
        Write-Host "[floodwatch] Starting services in WSL2..." -ForegroundColor Cyan
        Invoke-Wsl "bash ~/.floodwatch/start-services.sh"
    }
    "stop" {
        Write-Host "[floodwatch] Stopping services in WSL2..." -ForegroundColor Cyan
        Invoke-Wsl "bash ~/.floodwatch/stop-services.sh"
    }
    "restart" {
        Write-Host "[floodwatch] Restarting services in WSL2..." -ForegroundColor Cyan
        Invoke-Wsl "bash ~/.floodwatch/stop-services.sh"
        Start-Sleep -Seconds 2
        Invoke-Wsl "bash ~/.floodwatch/start-services.sh"
    }
    "status" {
        Invoke-Wsl "bash ~/.floodwatch/status-services.sh"
    }
    "logs" {
        Write-Host "[floodwatch] Tailing WSL2 logs (Ctrl+C to stop)..." -ForegroundColor Cyan
        Invoke-Wsl "tail -f ~/.floodwatch/logs/*.log"
    }
}

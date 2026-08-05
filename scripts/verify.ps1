# FloodWatch AI — Full verification gate
# Usage: .\scripts\verify.ps1 [-SkipNode] [-SkipPython] [-Service <name>]
#
# Runs the complete quality gate:
#   1. turbo typecheck (all workspaces)
#   2. turbo lint       (all workspaces)
#   3. pytest           (every Python service)
#
# Exits 0 only when every stage passes. Designed to be called from
# scripts/save-work.ps1 before any commit.

param(
    [switch]$SkipNode,
    [switch]$SkipPython,
    [string]$Service = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$results = [System.Collections.Generic.List[object]]::new()

function Invoke-Stage {
    param([string]$Name, [scriptblock]$Body)
    Write-Host ""
    Write-Host "==> $Name" -ForegroundColor Cyan
    try {
        & $Body
        if ($LASTEXITCODE -ne 0) { throw "stage exited with code $LASTEXITCODE" }
        $script:results.Add([pscustomobject]@{ Stage = $Name; Status = "PASS"; Detail = "ok" })
        Write-Host "    PASS" -ForegroundColor Green
    } catch {
        $script:results.Add([pscustomobject]@{ Stage = $Name; Status = "FAIL"; Detail = $_.Exception.Message })
        Write-Host "    FAIL: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Push-Location $root

# 1. TypeScript typecheck
if (-not $SkipNode) {
    Invoke-Stage "typecheck" {
        if (-not (Test-Path "node_modules\turbo\bin\turbo")) { throw "turbo not installed - run 'npm install' first" }
        # Run via cmd /c: turbo writes its banner to stderr, and PowerShell 5.1 wraps
        # native stderr as terminating errors when $ErrorActionPreference = "Stop",
        # which killed this stage before turbo could run. cmd merges the streams.
        cmd /c "node node_modules\turbo\bin\turbo run typecheck --continue 2>&1"
        if ($LASTEXITCODE -ne 0) { throw "typecheck failed (exit code $LASTEXITCODE)" }
    }
}

# 2. Lint
if (-not $SkipNode) {
    Invoke-Stage "lint" {
        cmd /c "node node_modules\turbo\bin\turbo run lint --continue 2>&1"
        if ($LASTEXITCODE -ne 0) { throw "lint failed (exit code $LASTEXITCODE)" }
    }
}

# 3. Python tests
if (-not $SkipPython) {
    $services = if ($Service) { @($Service) } else { Get-ChildItem services -Directory | ForEach-Object Name }
    $anyFailed = $false
    foreach ($svc in $services) {
        $testDir = "services\$svc\tests"
        if (-not (Test-Path $testDir)) { continue }
        Write-Host "==> pytest: $svc" -ForegroundColor Cyan
        python -m pytest $testDir -q --no-header 2>&1 | Select-Object -Last 3 | ForEach-Object { Write-Host $_ }
        if ($LASTEXITCODE -ne 0) { $anyFailed = $true }
    }
    if ($anyFailed) {
        $script:results.Add([pscustomobject]@{ Stage = "pytest"; Status = "FAIL"; Detail = "one or more services failed" })
    } else {
        $script:results.Add([pscustomobject]@{ Stage = "pytest"; Status = "PASS"; Detail = "all services" })
    }
}

Pop-Location

# ── Summary ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "===================== VERIFICATION SUMMARY =====================" -ForegroundColor Cyan
$pass = 0; $fail = 0
foreach ($r in $results) {
    $color = if ($r.Status -eq "PASS") { "Green" } else { "Red" }
    Write-Host ("  [{0}] {1,-12} {2}" -f $r.Status, $r.Stage, $r.Detail) -ForegroundColor $color
    if ($r.Status -eq "PASS") { $pass++ } else { $fail++ }
}
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ("  {0} passed, {1} failed" -f $pass, $fail)
Write-Host "=================================================================" -ForegroundColor Cyan

if ($fail -gt 0) { exit 1 } else { exit 0 }

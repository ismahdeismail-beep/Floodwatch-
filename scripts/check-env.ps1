# FloodWatch AI — Environment health check
# Usage: .\scripts\check-env.ps1 [-All]
#
# Reports the health of every toolchain the platform needs:
#   Node/npm, Python, Docker, turbo, workspace deps, .env files,
#   git state, installed skills, Vercel token availability.
# Exit code 0 when the minimum requirements pass, 1 otherwise.

param([switch]$All)

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
$rows = [System.Collections.Generic.List[object]]::new()

function Add-Check {
    param([string]$Name, [bool]$Ok, [string]$Detail = "")
    $rows.Add([pscustomobject]@{ Name = $Name; Status = $(if ($Ok) { "OK" } else { "MISSING" }); Detail = $Detail })
    $color = if ($Ok) { "Green" } else { "Red" }
    Write-Host ("  [{0}] {1,-32} {2}" -f $(if ($Ok) { "OK" } else { "!!" }), $Name, $Detail) -ForegroundColor $color
}

Write-Host "==> FloodWatch AI environment check" -ForegroundColor Cyan

# ── Runtimes ────────────────────────────────────────────────────────────
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) { Add-Check "Node" $true (node --version) } else { Add-Check "Node" $false }
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) { Add-Check "npm" $true (npm --version) } else { Add-Check "npm" $false }
$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) { Add-Check "Python" $true (python --version) } else { Add-Check "Python" $false }
$docker = Get-Command docker -ErrorAction SilentlyContinue
if ($docker) { Add-Check "Docker" $true (docker --version) } else { Add-Check "Docker" $false }

# ── Project tooling ─────────────────────────────────────────────────────
Add-Check "turbo binary" (Test-Path "$root\node_modules\turbo\bin\turbo") "node_modules\turbo\bin\turbo"
Add-Check "next swc (win-x64)" (Test-Path "$root\node_modules\@next\swc-win32-x64-msvc") "SWC compiler for Next.js"
Add-Check "workspaces installed" (Test-Path "$root\node_modules\.bin") "npm .bin links present"
$pytest = Get-Command pytest -ErrorAction SilentlyContinue
if ($pytest) { Add-Check "pytest" $true "pytest $($pytest.Version)" } else { Add-Check "pytest" $false "run 'pip install pytest'" }

# ── .env files ──────────────────────────────────────────────────────────
$envMissing = @()
foreach ($svc in (Get-ChildItem "$root\services" -Directory | ForEach-Object Name)) {
    if (-not (Test-Path "$root\services\$svc\.env.example")) { $envMissing += $svc }
}
Add-Check "service env files" ($envMissing.Count -eq 0) $(if ($envMissing) { "missing: $($envMissing -join ', ')" } else { "all present or templated" })

# ── Git state ───────────────────────────────────────────────────────────
if (Test-Path "$root\.git") {
    $branch = git -C $root rev-parse --abbrev-ref HEAD 2>$null
    $remote = git -C $root remote 2>$null
    $dirty = git -C $root status --porcelain 2>$null | Measure-Object -Line
    Add-Check "git repo" $true "branch=$branch remote=$remote dirty=$($dirty.Lines)"
} else {
    Add-Check "git repo" $false "not initialized"
}

# ── Skills + Vercel token ───────────────────────────────────────────────
$claudeSkills = @(Get-ChildItem "C:\Users\ADMIN\.claude\skills" -Directory -ErrorAction SilentlyContinue)
$agentsSkills = @(Get-ChildItem "C:\Users\ADMIN\.agents\skills" -Directory -ErrorAction SilentlyContinue)
Add-Check "superpowers skills" (($claudeSkills.Name -contains "writing-plans") -or ($agentsSkills.Name -contains "writing-plans")) "writing-plans present"
$tokenFile = "C:\Users\ADMIN\Desktop\PROJECTS-WEBSITES\SKILLS\VERCEL TOKEN KEY.txt"
$tokenOk = (Test-Path $tokenFile) -and ((Get-Content $tokenFile -Raw).Trim().Length -gt 10)
Add-Check "vercel token" $tokenOk "SKILLS\VERCEL TOKEN KEY.txt"

# ── Summary ─────────────────────────────────────────────────────────────
Write-Host ""
$fail = @($rows | Where-Object { $_.Status -eq "MISSING" })
Write-Host "==> $($rows.Count - $fail.Count)/$($rows.Count) checks OK" -ForegroundColor Cyan
if ($fail.Count -gt 0) {
    Write-Host "    Missing: $($fail.Name -join ', ')" -ForegroundColor Yellow
    exit 1
}
exit 0

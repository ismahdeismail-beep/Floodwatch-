# FloodWatch AI — Windows PowerShell setup script
# Usage: .\scripts\setup.ps1

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

Write-Host "==> FloodWatch AI setup (Windows) $([char]0x1F30A)" -ForegroundColor Cyan

# 1. .env from template
$envFile = Join-Path $root ".env"
if (-not (Test-Path -LiteralPath $envFile)) {
    Copy-Item -LiteralPath (Join-Path $root ".env.example") -Destination $envFile
    Write-Host "    .env created from .env.example (edit credentials as needed)." -ForegroundColor Yellow
} else {
    Write-Host "    .env already exists - skipping." -ForegroundColor Green
}

# 2. Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "    Docker not found. Install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# 3. Start core infrastructure
Write-Host "==> Starting core infrastructure (postgres, redis, minio)..." -ForegroundColor Cyan
docker compose up -d postgres redis minio
if ($LASTEXITCODE -ne 0) { throw "docker compose failed" }

# 4. Install JS workspace dependencies
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "==> Installing JS workspace dependencies..." -ForegroundColor Cyan
    Push-Location $root
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    Pop-Location
} else {
    Write-Host "    Node.js not found - skipping npm install." -ForegroundColor Yellow
}

Write-Host "==> Done. Next: python scripts/seed-demo-data.py ; npm run dev" -ForegroundColor Green

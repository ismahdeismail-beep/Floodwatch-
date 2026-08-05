# FloodWatch AI — Save work: verify -> commit -> push -> (deploy)
# Usage: .\scripts\save-work.ps1 -Message "feat: add weather providers" [-Deploy] [-NoVerify]
#
# The one-command workflow for every completed unit of work:
#   1. Runs scripts/verify.ps1 (unless -NoVerify)
#   2. Stages all changes, commits with a conventional message
#   3. Pushes to the git remote
#   4. Optionally deploys the web app to Vercel (-Deploy)
#
# Reads the Vercel token from SKILLS\VERCEL TOKEN KEY.txt when deploying.
# Requires the token file to exist on Desktop (see AGENTS.md rule 9).

param(
    [Parameter(Mandatory = $true)][string]$Message,
    [switch]$Deploy,
    [switch]$NoVerify,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Push-Location $root

# 1. Verification gate
if (-not $NoVerify) {
    Write-Host "==> Running verification gate..." -ForegroundColor Cyan
    & "$PSScriptRoot\verify.ps1"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Verification FAILED - fix errors before committing." -ForegroundColor Red
        Pop-Location; exit 1
    }
    Write-Host "Verification passed." -ForegroundColor Green
}

# 2. Git sanity checks
if (-not (Test-Path ".git")) {
    Write-Host "Not a git repository - run 'git init' first." -ForegroundColor Red
    Pop-Location; exit 1
}
if (-not (git diff --cached --quiet 2>$null)) {
    Write-Host "Unstaged staged changes detected (git add needed). Continuing with full add..." -ForegroundColor Yellow
}

git add -A
$staged = git diff --cached --stat
if (-not $staged) {
    Write-Host "No changes to commit - working tree clean." -ForegroundColor Yellow
    Pop-Location; exit 0
}

# 3. Commit
if ($DryRun) {
    Write-Host "DRY RUN - would commit: $Message" -ForegroundColor Yellow
    Write-Host $staged
    Pop-Location; exit 0
}

git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit failed." -ForegroundColor Red
    Pop-Location; exit 1
}
Write-Host "Committed: $Message" -ForegroundColor Green

# 4. Push
$branch = git rev-parse --abbrev-ref HEAD
if (git remote) {
    Write-Host "==> Pushing $branch ..." -ForegroundColor Cyan
    git push origin $branch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed - check remote." -ForegroundColor Red
        Pop-Location; exit 1
    }
    Write-Host "Pushed to origin/$branch." -ForegroundColor Green
} else {
    Write-Host "No git remote configured - skipped push." -ForegroundColor Yellow
}

# 5. Optional Vercel deploy
if ($Deploy) {
    Write-Host "==> Deploying to Vercel..." -ForegroundColor Cyan
    $tokenFile = "C:\Users\ADMIN\Desktop\PROJECTS-WEBSITES\SKILLS\VERCEL TOKEN KEY.txt"
    if (-not (Test-Path $tokenFile)) {
        Write-Host "Vercel token file not found - skipping deploy." -ForegroundColor Red
        Pop-Location; exit 1
    }
    $env:VERCEL_TOKEN = (Get-Content $tokenFile -Raw).Trim()
    if (-not $env:VERCEL_TOKEN) {
        Write-Host "Vercel token is empty - skipping deploy." -ForegroundColor Red
        Pop-Location; exit 1
    }
    npx vercel deploy --token $env:VERCEL_TOKEN --yes
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Vercel deploy failed." -ForegroundColor Red
        Pop-Location; exit 1
    }
    Write-Host "Deployed to Vercel." -ForegroundColor Green
}

Pop-Location
Write-Host "Save-work complete." -ForegroundColor Green
exit 0

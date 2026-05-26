# Sync GITHUB_PERSONAL_ACCESS_TOKEN for Cursor GitHub MCP (User scope).
# Requires: gh auth login

$ErrorActionPreference = 'Stop'

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host 'gh CLI not found. Install: https://cli.github.com/' -ForegroundColor Yellow
    exit 1
}

$null = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Run: gh auth login' -ForegroundColor Yellow
    exit 1
}

$token = (gh auth token).Trim()
if (-not $token) {
    Write-Host 'Could not read token from gh.' -ForegroundColor Red
    exit 1
}

[Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', $token, 'User')
$env:GITHUB_PERSONAL_ACCESS_TOKEN = $token

Write-Host 'Set GITHUB_PERSONAL_ACCESS_TOKEN (User env, from gh auth token).' -ForegroundColor Green
Write-Host 'Restart Cursor completely, then check Settings -> MCP (github green).' -ForegroundColor Cyan

$headers = @{
    Authorization = "Bearer $token"
    'User-Agent'    = 'tomato-clock-setup'
}
$user = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers
Write-Host "GitHub API OK: $($user.login)" -ForegroundColor Green

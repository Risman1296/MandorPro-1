# MandorPro Production Local Runner - Simple Version
param([switch]$Help)

if ($Help) {
    Write-Host @"
MandorPro Production Local Runner

REQUIRED ENVIRONMENT VARIABLES:
    PORT=3000
    DATABASE_URL=sqlite:///./data/prod.db  
    NODE_ENV=production

USAGE:
    `$env:PORT = "3000"
    `$env:DATABASE_URL = "sqlite:///./data/prod.db"
    `$env:NODE_ENV = "production"
    .\scripts\run-prod-local.ps1
"@
    exit 0
}

Write-Host "🏗️  MandorPro Production Runner" -ForegroundColor Blue

# Check environment
if (-not $env:PORT) { Write-Host "❌ Missing PORT" -ForegroundColor Red; exit 1 }
if (-not $env:DATABASE_URL) { Write-Host "❌ Missing DATABASE_URL" -ForegroundColor Red; exit 1 }
if ($env:NODE_ENV -ne "production") { Write-Host "❌ NODE_ENV must be 'production'" -ForegroundColor Red; exit 1 }

Write-Host "✅ Environment OK - PORT:$env:PORT NODE_ENV:$env:NODE_ENV" -ForegroundColor Green

# Detect package manager
if (Test-Path "package-lock.json") { $pm = "npm" }
elseif (Test-Path "yarn.lock") { $pm = "yarn" } 
else { $pm = "npm" }

Write-Host "✅ Using $pm" -ForegroundColor Green

# Start server
Write-Host "🚀 Starting server on port $env:PORT..." -ForegroundColor Blue

switch ($pm) {
    "npm" { Start-Process "npx" "expo start --port $env:PORT --no-dev --minify" -PassThru }
    "yarn" { Start-Process "yarn" "expo start --port $env:PORT --no-dev --minify" -PassThru }
}

Write-Host "✅ Server started!" -ForegroundColor Green
Write-Host "🌐 Access: http://localhost:$env:PORT" -ForegroundColor Blue
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
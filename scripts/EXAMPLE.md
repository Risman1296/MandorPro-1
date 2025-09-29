# Example: Running MandorPro in Production Mode

## Windows PowerShell Example

```powershell
# Navigate to project
cd C:\Projects\MandorPro\MandorPro

# Set required environment variables
$env:PORT = "3000"
$env:DATABASE_URL = "sqlite:///./data/prod.db"
$env:NODE_ENV = "production"

# Run the production script
.\scripts\run-prod-local.ps1

# Output will show:
# 🏗️  MandorPro Production Runner
# ✅ Environment OK - PORT:3000 NODE_ENV:production
# ✅ Using npm
# 🚀 Starting server on port 3000...
# ✅ Server started!
# 🌐 Access: http://localhost:3000
# Press Ctrl+C to stop
```

## Unix/Linux/macOS Bash Example

```bash
# Navigate to project
cd /path/to/MandorPro

# Set required environment variables
export PORT=3000
export DATABASE_URL="sqlite:///./data/prod.db"
export NODE_ENV=production

# Make script executable (first time)
chmod +x scripts/run-prod-local.sh

# Run the production script
./scripts/run-prod-local.sh

# The script will:
# 1. ✅ Check environment variables
# 2. 🔍 Detect package manager (npm/yarn/pnpm)
# 3. 📦 Install dependencies if needed
# 4. 🏗️  Build production bundle
# 5. 🚀 Start server in production mode
# 6. ⏳ Wait for port to be ready (60s timeout)
# 7. 📋 Show service info and URLs
# 8. 🏃 Keep running until Ctrl+C
```

## Quick Start

### For Windows:
```powershell
$env:PORT="3000"; $env:DATABASE_URL="sqlite:///./data/prod.db"; $env:NODE_ENV="production"; .\scripts\run-prod-local.ps1
```

### For Unix/Linux/macOS:
```bash
PORT=3000 DATABASE_URL="sqlite:///./data/prod.db" NODE_ENV=production ./scripts/run-prod-local.sh
```

## What You'll See

When successful, both scripts will show:

```
🏗️  MandorPro Production Local Runner
==========================================
ℹ️  Checking required environment variables...
✅ Environment variables validated
  PORT: 3000
  DATABASE_URL: sqlite:///./data/prod.db
  NODE_ENV: production

✅ Detected package manager: npm

🚀 Starting production server on port 3000...
✅ Server started with PID: 12345

🚀 MandorPro is running in production mode!

┌─────────────────────────────────────────┐
│              Service Info               │
├─────────────────────────────────────────┤
│ URL:     http://localhost:3000          │
│ PID:     12345                          │
│ Mode:    Production                     │
│ Logs:    expo.log                       │
└─────────────────────────────────────────┘

ℹ️  Available endpoints:
  • Web:     http://localhost:3000
  • QR Code: Check Expo DevTools

ℹ️  Press Ctrl+C to stop the server...
```
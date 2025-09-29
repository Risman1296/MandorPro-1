# Production Local Scripts

Scripts untuk menjalankan MandorPro dalam mode production secara local.

## 📁 Files

- `run-prod-local.sh` - Shell script untuk Unix/Linux/macOS
- `run-prod-local.ps1` - PowerShell script untuk Windows

## 🚀 Usage

### Windows (PowerShell)
```powershell
# Set environment variables
$env:PORT = "3000"
$env:DATABASE_URL = "sqlite:///./data/prod.db"
$env:NODE_ENV = "production"

# Run the script
.\scripts\run-prod-local.ps1

# For help
.\scripts\run-prod-local.ps1 -Help
```

### Unix/Linux/macOS (Bash)
```bash
# Set environment variables
export PORT=3000
export DATABASE_URL="sqlite:///./data/prod.db"
export NODE_ENV=production

# Make script executable (first time only)
chmod +x scripts/run-prod-local.sh

# Run the script
./scripts/run-prod-local.sh
```

## 🔧 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | ✅ Yes | Port untuk server | `3005` |
| `DATABASE_URL` | ✅ Yes | Database connection string | `sqlite:///./data/prod.db` |
| `NODE_ENV` | ✅ Yes | Must be `production` | `production` |

## ✨ Features

✅ **Environment Check** - Memvalidasi semua environment variables yang diperlukan
✅ **Package Manager Detection** - Otomatis detect npm/pnpm/yarn
✅ **Production Build** - Menjalankan build steps untuk optimasi
✅ **Background Server** - Server berjalan di background dengan PID tracking
✅ **Port Health Check** - Menunggu hingga port siap (timeout 60s)
✅ **Service Info** - Menampilkan URL dan informasi service
✅ **Graceful Cleanup** - Trap handler untuk cleanup saat script keluar
✅ **Colored Output** - Output berwarna untuk readability yang lebih baik

## 🔄 What the Scripts Do

1. **Validate Environment** - Check PORT, DATABASE_URL, NODE_ENV
2. **Detect Package Manager** - Auto-detect npm/pnpm/yarn berdasarkan lock files
3. **Install Dependencies** - Install jika node_modules belum ada
4. **Build Production** - Run build script atau expo export
5. **Start Server** - Launch Expo server dalam production mode
6. **Health Check** - Wait hingga port ready (max 60s)
7. **Show Info** - Display service URL, PID, dan log location
8. **Monitor** - Keep running sampai Ctrl+C

## 🛑 Stopping the Server

- **Ctrl+C** - Graceful shutdown dengan cleanup
- **Kill PID** - `kill <PID>` (Linux/macOS) atau `Stop-Process -Id <PID>` (Windows)

## 📋 Logs

Server logs akan ditulis ke `expo.log` file.

### Monitor real-time logs:
```bash
# Linux/macOS
tail -f expo.log

# Windows PowerShell
Get-Content expo.log -Wait
```

## 🌐 Access Points

Setelah server running:

- **Web App**: http://localhost:PORT
- **QR Code**: Available di Expo DevTools
- **Mobile**: Scan QR code dengan Expo Go app

## 🐛 Troubleshooting

### Port already in use
```bash
# Find process using the port
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill the process
kill <PID>              # Linux/macOS
Stop-Process -Id <PID>  # Windows
```

### Database connection issues
- Pastikan DATABASE_URL path benar
- Pastikan direktori database sudah ada
- Check file permissions

### Build failures
- Pastikan dependencies sudah terinstall
- Check Node.js version compatibility
- Clear cache: `npm cache clean --force`

### Server won't start
- Check port availability
- Verify environment variables
- Check expo.log untuk error details
- Try different PORT number

## 📚 Examples

### Complete Setup Example (Windows)
```powershell
# Navigate to project
cd C:\Projects\MandorPro

# Set environment
$env:PORT = "3005"
$env:DATABASE_URL = "sqlite:///./data/mandorpro.db"
$env:NODE_ENV = "production"

# Run server
.\scripts\run-prod-local.ps1

# Server will be available at http://localhost:3005
```

### Complete Setup Example (Linux/macOS)
```bash
# Navigate to project
cd /path/to/MandorPro

# Set environment
export PORT=3000
export DATABASE_URL="sqlite:///./data/mandorpro.db"
export NODE_ENV=production

# Make executable and run
chmod +x scripts/run-prod-local.sh
./scripts/run-prod-local.sh

# Server will be available at http://localhost:3000
```

## 🎯 Use Cases

- **Production Testing** - Test aplikasi dalam mode production secara local
- **Performance Testing** - Benchmark app dengan optimization enabled
- **Pre-deployment Validation** - Validate sebelum deploy ke server
- **Demo/Presentation** - Stable production build untuk demo
- **CI/CD Integration** - Automated testing dalam production mode
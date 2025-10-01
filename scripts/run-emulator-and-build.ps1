# --- One-shot Android emulator + run Expo on Windows ---
# Param yang bisa diubah
param(
    [string]$ProjectPath = "C:\Projects\MandorPro",
    [string]$AvdName = "Pixel_7_API_36",
    [int]   $ApiLevel = 36,
    [string]$Image = "google_apis_playstore",
    [string]$Arch = "x86_64",
    [string]$Sdk = $null
)

# 0) Resolve Android SDK path
if (-not $Sdk -or -not (Test-Path $Sdk)) {
    $candidates = @(
        $env:ANDROID_SDK_ROOT,
        $env:ANDROID_HOME,
        "$env:LOCALAPPDATA\Android\Sdk",
        "$env:USERPROFILE\AppData\Local\Android\Sdk"
    ) | Where-Object { $_ -and (Test-Path $_) }
    if ($candidates.Count -gt 0) { $Sdk = $candidates[0] }
}

if (-not $Sdk -or -not (Test-Path $Sdk)) {
    Write-Error "Android SDK tidak ditemukan. Install Android Studio atau set ANDROID_SDK_ROOT/ANDROID_HOME."
    exit 1
}

Write-Host "SDK: $Sdk"

# 1) Lokasi tools
$sdkmanager = Join-Path $Sdk 'cmdline-tools\latest\bin\sdkmanager.bat'
if (-not (Test-Path $sdkmanager)) {
    $alt = Join-Path $Sdk 'cmdline-tools\bin\sdkmanager.bat'
    if (Test-Path $alt) { $sdkmanager = $alt }
}
# Try to auto-discover sdkmanager under any versioned cmdline-tools folder
if (-not (Test-Path $sdkmanager)) {
    $found = Get-ChildItem -Path (Join-Path $Sdk 'cmdline-tools') -Filter sdkmanager.bat -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $sdkmanager = $found.FullName }
}

$avdmanager = Join-Path $Sdk 'cmdline-tools\latest\bin\avdmanager.bat'
if (-not (Test-Path $avdmanager)) {
    $alt = Join-Path $Sdk 'cmdline-tools\bin\avdmanager.bat'
    if (Test-Path $alt) { $avdmanager = $alt }
}
# Try to auto-discover avdmanager too
if (-not (Test-Path $avdmanager)) {
    $found = Get-ChildItem -Path (Join-Path $Sdk 'cmdline-tools') -Filter avdmanager.bat -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $avdmanager = $found.FullName }
}
$emulator = Join-Path $Sdk 'emulator\emulator.exe'
$adb = Join-Path $Sdk 'platform-tools\adb.exe'

foreach ($p in @($sdkmanager, $avdmanager, $emulator, $adb)) {
    if (-not (Test-Path $p)) {
        Write-Host "Tool missing: $p"
    }
}

# 2) Pastikan komponen SDK terinstal + accept licenses
if (Test-Path $sdkmanager) {
    Write-Host "Menginstall komponen SDK (boleh lama)..."
    & $sdkmanager --install `
        "platform-tools" `
        "emulator" `
        "cmdline-tools;latest" `
        "platforms;android-$ApiLevel" `
        "system-images;android-$ApiLevel;$Image;$Arch"

    # Accept licenses (auto 'y')
    $answers = ("y`r`n" * 200)
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $sdkmanager
    $psi.Arguments = "--licenses"
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $p = [System.Diagnostics.Process]::Start($psi)
    $p.StandardInput.Write($answers)
    $p.StandardInput.Close()
    $p.WaitForExit()
    Write-Host ($p.StandardOutput.ReadToEnd())
}

# 3) AVD: buat jika belum ada
$avdDir = Join-Path $env:USERPROFILE ".android\avd\$AvdName.avd"
if (-not (Test-Path $avdDir)) {
    if (-not (Test-Path $avdmanager)) {
        Write-Error "avdmanager tidak ditemukan. Pastikan cmdline-tools terinstal."
        exit 1
    }
    Write-Host "Membuat AVD $AvdName ..."
    & $avdmanager create avd `
        -n $AvdName `
        -k "system-images;android-$ApiLevel;$Image;$Arch" `
        --device "pixel_7" `
        --sdcard 2048M `
        -f
}
else {
    Write-Host "AVD $AvdName sudah ada."
}

# 4) Start ADB
& $adb kill-server | Out-Null
& $adb start-server | Out-Null
& $adb devices

# 5) Start emulator (jika belum jalan)
Write-Host "Menjalankan emulator $AvdName ..."
Start-Process -FilePath $emulator -ArgumentList @(
    "-avd", $AvdName,
    "-no-snapshot", "-no-boot-anim",
    "-accel", "on", "-netdelay", "none", "-netspeed", "full"
) | Out-Null

# 6) Tunggu device online + boot selesai
$deviceId = $null
for ($i = 0; $i -lt 120; $i++) {
    $out = & $adb devices
    $m = ($out | Select-String -Pattern 'emulator-\d+\s+device').Matches
    if ($m.Count -gt 0) {
        $deviceId = ($m[0].Value -replace '\s+device', '').Trim()
        break
    }
    Start-Sleep -Seconds 2
}
if (-not $deviceId) {
    Write-Error "Emulator tidak terdeteksi online. Cek Hyper-V/WHPX atau driver hypervisor."
    exit 1
}
Write-Host "Device: $deviceId (online). Menunggu boot selesai..."

for ($i = 0; $i -lt 120; $i++) {
    $boot = & $adb -s $deviceId shell getprop sys.boot_completed 2>$null
    if ($boot -match '1') { break }
    Start-Sleep -Seconds 2
}

# 7) Jalankan build ke device
Write-Host "Menjalankan 'expo run:android' ke $deviceId ..."
Push-Location $ProjectPath
& npx expo run:android -d $deviceId
$code = $LASTEXITCODE
Pop-Location

if ($code -ne 0) {
    Write-Error "Build gagal dengan exit code $code. Lihat log di atas untuk detail."
    exit $code
}

Write-Host "Selesai. App harusnya sudah terpasang & terbuka di emulator $deviceId."

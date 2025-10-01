# Build → start emulator → install → launch → test (Windows PowerShell)
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-install-launch.ps1
# Optional args:
#   -ProjectPath "C:\\Projects\\MandorPro" -AvdName "Pixel_7_API_36"
param(
  [string]$ProjectPath = (Resolve-Path "$PSScriptRoot\..\").Path,
  [string]$AvdName = $null
)

$ErrorActionPreference = 'Stop'

function Get-AndroidSdkRoot {
  $candidates = @(
    $env:ANDROID_SDK_ROOT,
    $env:ANDROID_HOME,
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk"
  ) | Where-Object { $_ -and (Test-Path $_) }
  if ($candidates.Count -gt 0) { return $candidates[0] }
  throw "ANDROID_HOME / ANDROID_SDK_ROOT tidak ditemukan. Install Android Studio atau set env var."
}

function Ensure-Tool([string]$path, [string]$name) {
  if (-not (Test-Path $path)) { throw "$name tidak ditemukan: $path" }
  return $path
}

$Sdk = Get-AndroidSdkRoot
$Adb = Join-Path $Sdk 'platform-tools\adb.exe'
$Emulator = Join-Path $Sdk 'emulator\emulator.exe'
$BuildToolsDir = Get-ChildItem -Path (Join-Path $Sdk 'build-tools') -Directory -ErrorAction SilentlyContinue | Sort-Object Name | Select-Object -Last 1
$Aapt = $null
if ($BuildToolsDir) {
  $a1 = Join-Path $BuildToolsDir.FullName 'aapt.exe'
  if (Test-Path $a1) { $Aapt = $a1 }
}
if (-not $Aapt) {
  $aOnPath = (Get-Command aapt -ErrorAction SilentlyContinue)
  if ($aOnPath) { $Aapt = $aOnPath.Source }
}

Ensure-Tool $Adb 'adb'
Ensure-Tool $Emulator 'emulator'
if (-not $Aapt) { Write-Warning "aapt tidak ditemukan (Build-Tools). Akan lanjut tanpa membaca launchable-activity." }

Push-Location $ProjectPath
try {
  # ==== GRADLE BUILD ====
  $gradlew = if (Test-Path '.\gradlew.bat') { '.\gradlew.bat' } else { '.\gradlew' }
  if (-not (Test-Path $gradlew)) { throw 'gradlew tidak ditemukan di project root.' }

  Write-Host '[INFO] Stopping Gradle daemon (best-effort)'
  cmd /c "$gradlew --stop" | Out-Null

  Write-Host '[INFO] Cleaning and assembling :app:assembleDebug'
  cmd /c "$gradlew clean :app:assembleDebug"

  # ==== TEMUKAN APK DEBUG ====
  $apk = $null
  $debugDir = Join-Path $ProjectPath 'app\build\outputs\apk\debug'
  if (Test-Path $debugDir) {
    $candidate = Get-ChildItem -Path $debugDir -Filter '*-debug.apk' -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($candidate) { $apk = $candidate.FullName }
  }
  if (-not $apk) {
    $candidate = Get-ChildItem -Path $ProjectPath -Filter '*-debug.apk' -File -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($candidate) { $apk = $candidate.FullName }
  }
  if (-not $apk) { throw 'APK debug tidak ditemukan setelah build.' }
  Write-Host "[INFO] APK: $apk"

  # ==== BACA PACKAGE & ACTIVITY ====
  $pkg = $null; $launchable = $null
  if ($Aapt) {
    $badging = & "$Aapt" dump badging "$apk" 2>$null
    if ($badging) {
      $pkg = ($badging | Select-String -Pattern "package: name='([^']+)'" -AllMatches).Matches | Select-Object -First 1 | ForEach-Object { $_.Groups[1].Value }
      $launchable = ($badging | Select-String -Pattern "launchable-activity: name='([^']+)'" -AllMatches).Matches | Select-Object -First 1 | ForEach-Object { $_.Groups[1].Value }
    }
  }
  if (-not $pkg) { Write-Warning 'Gagal membaca package name; akan lanjut install dan launch via monkey.' }

  # ==== SIAPKAN / JALANKAN EMULATOR ====
  & "$Adb" kill-server | Out-Null
  & "$Adb" start-server | Out-Null
  $device = (& "$Adb" devices) -split "`n" | Where-Object { $_ -match '\tdevice' } | Select-Object -First 1
  if (-not $device) {
    if (-not $AvdName) {
      $avds = & "$Emulator" -list-avds
      $AvdName = ($avds -split "`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1)
    }
    if (-not $AvdName) { throw 'Tidak ada AVD. Buat AVD di Android Studio > Device Manager.' }
    Write-Host "[INFO] Menjalankan emulator: $AvdName"
    Start-Process -FilePath $Emulator -ArgumentList @('-avd', $AvdName, '-netdelay', 'none', '-netspeed', 'full') | Out-Null

    Write-Host '[INFO] Menunggu device online...'
    & "$Adb" wait-for-device

    Write-Host -NoNewline '[INFO] Menunggu boot selesai'
    for ($i=0; $i -lt 120; $i++) {
      $boot = (& "$Adb" shell getprop sys.boot_completed 2>$null).Trim()
      if ($boot -eq '1') { Write-Host ' -> OK'; break }
      Write-Host -NoNewline '.'; Start-Sleep -Seconds 2
    }
  }

  # ==== INSTALL & LAUNCH ====
  Write-Host '[INFO] Install APK ke device/emulator'
  $rc = & "$Adb" install -r -d "$apk" 2>$null; $exit = $LASTEXITCODE
  if ($exit -ne 0) {
    if ($pkg) { & "$Adb" uninstall "$pkg" 2>$null | Out-Null }
    & "$Adb" install "$apk"
  }

  if ($pkg -and $launchable) {
    Write-Host "[INFO] Start activity: $pkg/$launchable"
    & "$Adb" shell am start -n "$pkg/$launchable" | Out-Null
  } elseif ($pkg) {
    Write-Host '[INFO] Launch via monkey'
    & "$Adb" shell monkey -p "$pkg" -c android.intent.category.LAUNCHER 1 | Out-Null
  } else {
    Write-Warning 'Package tidak diketahui; lewati auto-launch.'
  }

  # ==== INSTRUMENTATION TEST (opsional) ====
  $tasks = cmd /c "$gradlew -q tasks --all" 2>$null
  if ($tasks -and ($tasks -match ':app:connectedDebugAndroidTest')) {
    Write-Host '[INFO] Menjalankan instrumentation test...'
    cmd /c "$gradlew :app:connectedDebugAndroidTest"
  } else {
    Write-Host '[INFO] Task :app:connectedDebugAndroidTest tidak ada, lewati.'
  }

  Write-Host "[DONE] App terpasang dan dijalankan. APK: $apk"
}
finally {
  Pop-Location
}


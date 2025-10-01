@echo off
setlocal
cd /d %~dp0\..
REM Optional: install dependencies on first run
if not exist node_modules (
  echo Installing npm dependencies...
  call npm install || goto :eof
)

echo Starting Android emulator and building the app...
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-emulator-and-build.ps1 %*
endlocal


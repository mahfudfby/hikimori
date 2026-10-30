@echo off
echo ============================================
echo   HIKIMORI WEB 2.0 - AUTO INSTALL
echo ============================================
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js belum terinstall! Download di https://nodejs.org
  pause
  exit /b 1
)
echo [1/2] Install dependencies...
call npm install
echo [2/2] Menjalankan website di http://localhost:3000 ...
call npm start

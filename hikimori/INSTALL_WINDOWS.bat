@echo off
echo ============================================
echo   HIKIMORI WEB - AUTO INSTALL
echo   by Mahfudfebry
echo ============================================
echo.

:: Cek Node.js
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js belum terinstall!
  echo Silakan download di: https://nodejs.org
  pause
  exit /b 1
)

echo [1/4] Node.js ditemukan:
node -v
echo.

echo [2/4] Install semua dependencies...
npm install
echo.

echo [3/4] Install framer-motion (animasi)...
npm install framer-motion@latest
echo.

echo [4/4] Install react-intersection-observer...
npm install react-intersection-observer
echo.

echo ============================================
echo   SELESAI! Menjalankan website...
echo ============================================
echo.
echo Website akan terbuka di: http://localhost:3000
echo Tekan CTRL+C untuk menghentikan server
echo.
npm start

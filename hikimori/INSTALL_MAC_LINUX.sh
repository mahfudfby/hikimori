#!/bin/bash
echo "============================================"
echo "  HIKIMORI WEB - AUTO INSTALL"
echo "  by Mahfudfebry"
echo "============================================"
echo ""

# Cek Node.js
if ! command -v node &> /dev/null; then
  echo "[ERROR] Node.js belum terinstall!"
  echo "Download di: https://nodejs.org"
  exit 1
fi

echo "[1/4] Node.js ditemukan: $(node -v)"
echo ""

echo "[2/4] Install semua dependencies..."
npm install
echo ""

echo "[3/4] Install framer-motion (animasi)..."
npm install framer-motion@latest
echo ""

echo "[4/4] Install react-intersection-observer..."
npm install react-intersection-observer
echo ""

echo "============================================"
echo "  SELESAI! Menjalankan website..."
echo "============================================"
echo ""
echo "Buka browser: http://localhost:3000"
echo "Stop server: tekan CTRL+C"
echo ""
npm start

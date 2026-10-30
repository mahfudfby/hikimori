#!/usr/bin/env bash
set -e
echo "HIKIMORI WEB 2.0 - AUTO INSTALL"
command -v node >/dev/null || { echo "Node.js belum terinstall: https://nodejs.org"; exit 1; }
npm install
npm start

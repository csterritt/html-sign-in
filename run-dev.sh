#!/bin/bash
set -euo pipefail

trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
#  pm2 delete tw-build
}

#pm2 start --name tw-build "./node_modules/.bin/tailwindcss --watch -o public/static/style-XXXXXX.css --content './src/**/*.{js,ts,jsx,tsx}'"
vite

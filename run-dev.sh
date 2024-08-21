#!/bin/bash
set -euo pipefail

concurrently -c auto \
  -n tw-build,vite \
  "./node_modules/.bin/tailwindcss --watch -o public/static/style-XXXXXX.css --content './src/**/*.{js,ts,jsx,tsx}'" \
   ./node_modules/.bin/vite

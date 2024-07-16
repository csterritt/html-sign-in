#!/bin/bash -x
set -euo pipefail

rm -rf dist
npx tailwindcss -m -o public/static/style-XXXXXX.css --content './src/**/*.{js,ts,jsx,tsx}'
vite build
cp src/_headers src/_routes.json dist
cp src/index.html dist
node timestamp-build-filenames.js

#!/bin/bash
set -euo pipefail

rm -rf dist
./make-static-html.sh
npm run build-vite

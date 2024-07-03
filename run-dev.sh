#!/bin/bash
set -euo pipefail

trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
  pm2 delete run-wrang
}

./make-static-html.sh
pm2 start --name run-wrang "npx wrangler pages dev --compatibility-date=2023-10-02"
./node_modules/.bin/vite

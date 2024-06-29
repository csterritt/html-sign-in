#!/bin/bash
set -euo pipefail

rm -rf dist
npm run build-vite

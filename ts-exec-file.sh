#!/bin/bash
set -euo pipefail

# Run the given typescript file.
if [ "x${1-}" = "x" -o "x${2-}" != "x" ] ; then
  echo "Usage: ts-exec-file.sh typescript-file.ts"
  exit 1
fi

node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));' $1

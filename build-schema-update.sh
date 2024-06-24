#!/bin/bash
set -euo pipefail

function yes_or_no {
    while true; do
        read -p "$* [YES/n]: " yn
        case ${yn} in
            YES) return 0  ;;
            [Nn]*) echo "Cancelled" ; return  1 ;;
            *) ;;
        esac
    done
}

local="TRUE"
if [[ "x${1-}" != "x" ]] ; then
  local="FALSE"
fi

if [[ "${local}" = "TRUE" ]] ; then
  wrangler d1 execute html-sign-in-db --file=./schema.sql
else
  yes_or_no "Really update the remote database?"
  if [[ -n $? ]] ; then
    echo "Updating remote database in 5 seconds..."
    sleep 5
    echo "Updating remote database"
    wrangler d1 execute html-sign-in-db --remote --file=./schema-prod.sql
  fi
fi

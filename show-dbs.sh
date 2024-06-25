#!/bin/sh
set -euo pipefail

local=""
if [ "x${1-}" != "x" ] ; then
  local="--remote"
fi

wrangler d1 execute html-sign-in-db ${local} --command='select * from hsipeople;'
wrangler d1 execute html-sign-in-db ${local} --command='select * from hsisignupcodes;'
wrangler d1 execute html-sign-in-db ${local} --command='select * from hsisession;'

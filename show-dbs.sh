#!/bin/sh
set -euo pipefail

local="--local"
if [ "x${1-}" != "x" ] ; then
  local=""
fi

#wrangler d1 execute html-sign-in-db ${local} --command='select * from llpeople;'
#wrangler d1 execute html-sign-in-db ${local} --command='select * from llsignupcodes;'
#wrangler d1 execute html-sign-in-db ${local} --command='select * from llsession;'
wrangler d1 execute html-sign-in-db ${local} --command='select * from HSICounts;'

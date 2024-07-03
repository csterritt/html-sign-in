#!/bin/bash
set -euo pipefail

rm -rf src
mkdir -p src/
mkdir -p src/auth

node code-src/pages/index.js > src/index.html
node code-src/pages/404.js > src/404.html
node code-src/pages/auth/sign-in.js > src/auth/sign-in.html
cp code-src/style.css src/style.css

rm -f functions/api/testpage.js
./node_modules/.bin/rollup code-src/functions/api/testpage.js --file /tmp/testpage.js --format cjs
perl -ne 'if (/const onRequest\s+(.*)$/) { print "export const onRequest $1"; } elsif (/exports.onRequest = onRequest;/) {} else { print; }' \
  /tmp/testpage.js > functions/api/testpage.js
rm -f /tmp/testpage.js

rm -f functions/api/auth/submit-code.js
./node_modules/.bin/rollup code-src/functions/api/auth/submit-code.js --file /tmp/submit-code.js --format cjs
perl -ne 'if (/const onRequest\s+(.*)$/) { print "export const onRequest $1"; } elsif (/exports.onRequest = onRequest;/) {} else { print; }' \
  /tmp/submit-code.js > functions/api/auth/submit-code.js
rm -f /tmp/testpage.js

rm -f functions/api/auth/submit-email.js
./node_modules/.bin/rollup code-src/functions/api/auth/submit-email.js --file /tmp/submit-email.js --format cjs
perl -ne 'if (/const onRequest\s+(.*)$/) { print "export const onRequest $1"; } elsif (/exports.onRequest = onRequest;/) {} else { print; }' \
  /tmp/submit-email.js > functions/api/auth/submit-email.js
rm -f /tmp/testpage.js

rm -f functions/api/auth/await-code.js
./node_modules/.bin/rollup code-src/functions/api/auth/await-code.js --file /tmp/await-code.js --format cjs
perl -ne 'if (/const onRequest\s+(.*)$/) { print "export const onRequest $1"; } elsif (/exports.onRequest = onRequest;/) {} else { print; }' \
  /tmp/await-code.js > functions/api/auth/await-code.js
rm -f /tmp/testpage.js

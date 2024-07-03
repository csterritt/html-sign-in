#!/bin/bash
set -Eeuo pipefail

./clean-for-production.rb || exit 1
echo clean
git reset --hard HEAD
msg=$(./update-version.rb)
git commit -a -m "$msg"

git checkout main
git merge --no-commit -s ort -Xtheirs dev
./make-static-html.sh
./clean-for-production.rb ignore || exit 1
./make-static-html.sh
echo Changes brought over, please check and commit.

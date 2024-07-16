#!/bin/bash
set -Eeuo

./clean-for-production.rb || exit 1
echo clean
git reset --hard HEAD
msg=$(./update-version.rb)
git commit -a -m "$msg"

git checkout main
git merge --no-commit -s ort -Xtheirs dev || echo "Merge conflicts found, evidently."
./clean-for-production.rb ignore || exit 1
echo Changes brought over, please check and commit.

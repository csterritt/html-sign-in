#!/bin/bash
set -Eeuo

./clean-for-production.rb || exit 1
echo clean
git reset --hard HEAD
msg=$(./update-version.rb)
curl -s 'http://localhost:3000' > src/index.html || exit 1
git add src/index.html
git commit -a -m "$msg"

git checkout main
git merge --no-commit -s ort -Xtheirs dev || echo "Merge conflicts found, evidently."
./clean-for-production.rb ignore || exit 1
echo Changes brought over, please check and commit.

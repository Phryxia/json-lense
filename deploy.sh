#!/bin/bash
git switch main
git pull
git switch publish

if git merge --no-edit main; then
    npm run build
    git add docs/
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
    git commit -m "Deploy ${TIMESTAMP}"
    git push
    echo "Deploy ${TIMESTAMP} has been successfully completed."
else
    git merge --abort
    echo "There is a merge conflict. Please resolve it manually."
    exit 1
fi
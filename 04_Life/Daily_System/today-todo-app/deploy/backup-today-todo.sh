#!/bin/sh
set -eu

app_dir="/srv/pdw-apps/personal-digital-world/04_Life/Daily_System/today-todo-app"
cd "$app_dir"
docker compose exec -T -u 0 today-todo-app node scripts/backup-sqlite.mjs

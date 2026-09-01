import { copyFileSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const sourceArgument = process.argv[2];
if (!sourceArgument) {
  console.error("Usage: node scripts/restore-sqlite.mjs /backups/today-todo-TIMESTAMP.sqlite");
  process.exit(2);
}

const sourcePath = resolve(sourceArgument);
const databasePath = resolve(process.env.TODO_DB_PATH || "/data/today-todo.sqlite");
const check = new DatabaseSync(sourcePath, { readOnly: true });
try {
  const result = check.prepare("PRAGMA quick_check").get();
  if (result?.quick_check !== "ok") throw new Error("Backup failed SQLite quick_check");
} finally {
  check.close();
}

mkdirSync(dirname(databasePath), { recursive: true });
rmSync(`${databasePath}-wal`, { force: true });
rmSync(`${databasePath}-shm`, { force: true });
const rollbackPath = `${databasePath}.pre-restore-${Date.now()}`;
if (existsSync(databasePath)) renameSync(databasePath, rollbackPath);

try {
  copyFileSync(sourcePath, databasePath);
} catch (error) {
  if (existsSync(rollbackPath)) renameSync(rollbackPath, databasePath);
  throw error;
}

console.log(`Restored ${basename(sourcePath)} to ${databasePath}`);
if (existsSync(rollbackPath)) console.log(`Previous database preserved at ${rollbackPath}`);

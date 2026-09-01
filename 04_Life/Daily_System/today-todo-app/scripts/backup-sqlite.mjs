import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(process.env.TODO_DB_PATH || "/data/today-todo.sqlite");
const backupDirectory = resolve(process.env.TODO_BACKUP_DIR || "/backups");
const retention = Math.max(1, Number.parseInt(process.env.TODO_BACKUP_RETENTION || "30", 10));
const timestamp = new Date().toISOString().replaceAll(":", "-").replace(".000Z", "Z");
const backupPath = join(backupDirectory, `today-todo-${timestamp}.sqlite`);

mkdirSync(backupDirectory, { recursive: true });
const database = new DatabaseSync(databasePath, { readOnly: true });
try {
  const escapedPath = backupPath.replaceAll("'", "''");
  database.exec(`VACUUM INTO '${escapedPath}'`);
} finally {
  database.close();
}

const backups = readdirSync(backupDirectory)
  .filter((name) => /^today-todo-.*\.sqlite$/.test(name))
  .sort()
  .reverse();
for (const expired of backups.slice(retention)) {
  rmSync(join(backupDirectory, expired), { force: true });
}

console.log(`Backup created: ${basename(backupPath)}`);

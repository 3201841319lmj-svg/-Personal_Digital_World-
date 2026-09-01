import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SECTIONS, type SectionId, type Task } from "@/lib/types";

const sectionIds = new Set<string>(SECTIONS.map((section) => section.id));
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

type TaskRow = Omit<Task, "completed"> & { completed: number };

declare global {
  var todayTodoDatabase: DatabaseSync | undefined;
}

function databasePath() {
  return resolve(/* turbopackIgnore: true */ process.env.TODO_DB_PATH || ".data/today-todo.sqlite");
}

function initializeDatabase() {
  const path = databasePath();
  mkdirSync(dirname(path), { recursive: true });
  const database = new DatabaseSync(path);
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      section TEXT NOT NULL CHECK (section IN ('must', 'progress', 'later')),
      title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 120),
      completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
      parent_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS tasks_date_section_order
      ON tasks(date, section, sort_order, created_at);
    CREATE INDEX IF NOT EXISTS tasks_parent_id ON tasks(parent_id);

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  return database;
}

export function getDatabase() {
  if (!globalThis.todayTodoDatabase) {
    globalThis.todayTodoDatabase = initializeDatabase();
  }
  return globalThis.todayTodoDatabase;
}

function fromRow(row: TaskRow): Task {
  return { ...row, completed: row.completed === 1 };
}

export function parseDate(value: string | null, field: string) {
  const parts = value?.match(datePattern) ? value.split("-").map(Number) : [];
  const parsed = parts.length === 3 ? new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])) : null;
  if (
    !value ||
    !parsed ||
    parsed.getUTCFullYear() !== parts[0] ||
    parsed.getUTCMonth() !== parts[1] - 1 ||
    parsed.getUTCDate() !== parts[2]
  ) {
    throw new Error(`${field} must be a valid YYYY-MM-DD date`);
  }
  return value;
}

export function parseTask(value: unknown): Task {
  if (!value || typeof value !== "object") throw new Error("Task must be an object");
  const candidate = value as Partial<Task>;
  if (typeof candidate.id !== "string" || !candidate.id || candidate.id.length > 100) {
    throw new Error("Task id is invalid");
  }
  if (typeof candidate.date !== "string") throw new Error("Task date is invalid");
  parseDate(candidate.date, "Task date");
  if (typeof candidate.section !== "string" || !sectionIds.has(candidate.section)) {
    throw new Error("Task section is invalid");
  }
  const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
  if (!title || title.length > 120) throw new Error("Task title is invalid");
  if (typeof candidate.completed !== "boolean") throw new Error("Task completed is invalid");
  if (candidate.parent_id !== null && typeof candidate.parent_id !== "string") {
    throw new Error("Task parent_id is invalid");
  }
  if (!Number.isInteger(candidate.sort_order) || (candidate.sort_order ?? -1) < 0) {
    throw new Error("Task sort_order is invalid");
  }
  if (
    typeof candidate.created_at !== "string" ||
    Number.isNaN(Date.parse(candidate.created_at))
  ) {
    throw new Error("Task created_at is invalid");
  }
  return {
    id: candidate.id,
    date: candidate.date,
    section: candidate.section as SectionId,
    title,
    completed: candidate.completed,
    parent_id: candidate.parent_id,
    sort_order: candidate.sort_order as number,
    created_at: candidate.created_at,
  };
}

export function listTasks(from: string, to: string) {
  const rows = getDatabase()
    .prepare(`
      SELECT id, date, section, title, completed, parent_id, sort_order, created_at
      FROM tasks
      WHERE date >= ? AND date <= ?
      ORDER BY sort_order, created_at
    `)
    .all(from, to) as unknown as TaskRow[];
  return rows.map(fromRow);
}

export function upsertTasks(tasks: Task[]) {
  const database = getDatabase();
  const statement = database.prepare(`
    INSERT INTO tasks (
      id, date, section, title, completed, parent_id, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      date = excluded.date,
      section = excluded.section,
      title = excluded.title,
      completed = excluded.completed,
      parent_id = excluded.parent_id,
      sort_order = excluded.sort_order,
      created_at = excluded.created_at,
      updated_at = CURRENT_TIMESTAMP
  `);
  const ordered = [...tasks].sort((left, right) => Number(Boolean(left.parent_id)) - Number(Boolean(right.parent_id)));
  database.exec("BEGIN IMMEDIATE");
  try {
    for (const task of ordered) {
      statement.run(
        task.id,
        task.date,
        task.section,
        task.title,
        task.completed ? 1 : 0,
        task.parent_id,
        task.sort_order,
        task.created_at,
      );
    }
    database.prepare(`
      INSERT INTO app_meta(key, value) VALUES ('local_import_complete', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run();
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function deleteTasks(ids: string[]) {
  if (!ids.length) return;
  const database = getDatabase();
  const statement = database.prepare("DELETE FROM tasks WHERE id = ?");
  database.exec("BEGIN IMMEDIATE");
  try {
    for (const id of ids) statement.run(id);
    database.prepare(`
      INSERT INTO app_meta(key, value) VALUES ('local_import_complete', '1')
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run();
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function canImportLocalTasks() {
  const database = getDatabase();
  const count = database.prepare("SELECT COUNT(*) AS count FROM tasks").get() as { count: number };
  const completed = database
    .prepare("SELECT value FROM app_meta WHERE key = 'local_import_complete'")
    .get() as { value: string } | undefined;
  return count.count === 0 && completed?.value !== "1";
}

export function checkDatabase() {
  const row = getDatabase().prepare("PRAGMA quick_check").get() as { quick_check: string };
  return row.quick_check === "ok";
}

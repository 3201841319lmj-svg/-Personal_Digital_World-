"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SECTIONS, type SectionId, type Task } from "@/lib/types";

const STORAGE_KEY = "today-bake-tasks-v1";

function localDate(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readLocalTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Task[];
  } catch {
    return [];
  }
}

function writeLocalTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TodoDashboard() {
  const today = useMemo(() => localDate(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [openComposer, setOpenComposer] = useState<SectionId | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const history = useMemo(
    () => Array.from({ length: 15 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      return localDate(date);
    }),
    [],
  );

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const cachedTasks = readLocalTasks();
    try {
      const parameters = new URLSearchParams({ from: history.at(-1)!, to: today });
      const response = await fetch(`/api/tasks?${parameters}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load tasks");
      const data = (await response.json()) as { tasks: Task[]; canImportLocal: boolean };
      if (data.canImportLocal && cachedTasks.length) {
        const migration = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: cachedTasks }),
        });
        if (!migration.ok) throw new Error("Unable to migrate local tasks");
        setTasks(cachedTasks);
        setNotice("旧数据已迁移到服务器");
      } else {
        setTasks(data.tasks);
        writeLocalTasks(data.tasks);
        setNotice("服务器已同步");
      }
    } catch {
      setTasks(cachedTasks);
      setNotice("服务器暂不可用，显示本机缓存");
    }
    setLoading(false);
  }, [history, today]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadTasks(), 0);
    return () => window.clearTimeout(timer);
  }, [loadTasks]);

  async function persist(next: Task[], changed?: Task | Task[], removeIds: string[] = []) {
    const previous = tasks;
    setTasks(next);
    writeLocalTasks(next);
    try {
      const response = removeIds.length
        ? await fetch("/api/tasks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: removeIds }),
          })
        : await fetch("/api/tasks", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks: Array.isArray(changed) ? changed : changed ? [changed] : [] }),
          });
      if (!response.ok) throw new Error("Unable to save tasks");
      setNotice("已保存到服务器");
    } catch {
      setTasks(previous);
      writeLocalTasks(previous);
      setNotice("保存失败，已恢复原状");
    }
  }

  function addTask(section: SectionId, title: string, parentId: string | null = null) {
    const cleaned = title.trim();
    if (!cleaned) return;
    const item: Task = {
      id: createId(),
      date: selectedDate,
      section,
      title: cleaned,
      completed: false,
      parent_id: parentId,
      sort_order: tasks.filter((task) => task.date === selectedDate && task.section === section).length,
      created_at: new Date().toISOString(),
    };
    void persist([...tasks, item], item);
    setOpenComposer(null);
  }

  function toggleTask(task: Task) {
    const changed = { ...task, completed: !task.completed };
    const childIds = tasks.filter((item) => item.parent_id === task.id).map((item) => item.id);
    const changedTasks: Task[] = [];
    const next = tasks.map((item) => {
      if (item.id === task.id) return changed;
      if (childIds.includes(item.id)) {
        const child = { ...item, completed: changed.completed };
        changedTasks.push(child);
        return child;
      }
      return item;
    });
    void persist(next, [changed, ...changedTasks]);
  }

  function removeTask(task: Task) {
    const removeIds = [task.id, ...tasks.filter((item) => item.parent_id === task.id).map((item) => item.id)];
    void persist(tasks.filter((item) => !removeIds.includes(item.id)), undefined, removeIds);
  }

  const visibleTasks = tasks.filter((task) => task.date === selectedDate);
  const formattedDate = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date(`${selectedDate}T12:00:00`));

  return (
    <main className="shell">
      <div className="history-control">
        <button
          className="history-trigger"
          type="button"
          aria-label="历史记录"
          title="历史记录"
          aria-haspopup="menu"
          aria-expanded={historyOpen}
          onClick={() => setHistoryOpen((open) => !open)}
        >
          <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
        </button>
        {historyOpen && (
          <div className="history-menu" role="menu" aria-label="最近十五天历史记录">
            <div className="history-menu-heading">
              <span>最近 15 天</span>
              <button type="button" aria-label="关闭历史记录" onClick={() => setHistoryOpen(false)}>×</button>
            </div>
            <div className="history-list">
              {history.map((date, index) => (
                <button
                  key={date}
                  type="button"
                  role="menuitem"
                  className={date === selectedDate ? "history-item active" : "history-item"}
                  onClick={() => {
                    setSelectedDate(date);
                    setHistoryOpen(false);
                  }}
                >
                  <span>{index === 0 ? "今天" : new Intl.DateTimeFormat("zh-CN", { weekday: "short" }).format(new Date(`${date}T12:00:00`))}</span>
                  <strong>{new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(new Date(`${date}T12:00:00`))}</strong>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <header className="hero">
        <div className="brand-block">
          <p className="eyebrow">TODAY&apos;S LITTLE LIST</p>
          <h1>今日烘焙单</h1>
          <p className="intro">把今天揉成一小团，慢慢烤出刚刚好的进度。</p>
          <div className="today-meta">
            <span className="primary-date">{formattedDate}</span>
            <span className="sync-state">{notice}</span>
          </div>
        </div>
        <Image className="cat-hero" src="/cat-baker.svg" alt="戴着面包帽、端着咖啡的小猫" width={320} height={280} priority />
      </header>

      {loading ? (
        <div className="loading" role="status">正在翻开今天的清单…</div>
      ) : (
        <section className="board" aria-label={`${formattedDate}的待办`}>
          {SECTIONS.map((section) => {
            const parents = visibleTasks.filter((task) => task.section === section.id && !task.parent_id);
            return (
              <article className="task-section" key={section.id}>
                <header className="section-heading">
                  <span className="section-marker">{section.marker}</span>
                  <div><h2>{section.title}</h2><p>{section.hint}</p></div>
                </header>
                <div className="task-list">
                  {parents.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      subtasks={visibleTasks.filter((item) => item.parent_id === task.id)}
                      onToggle={toggleTask}
                      onRemove={removeTask}
                      onAddSubtask={(title) => addTask(section.id, title, task.id)}
                    />
                  ))}
                  {!parents.length && <p className="empty">这里还空着，给今天留一点呼吸。</p>}
                </div>
                {openComposer === section.id ? (
                  <QuickForm autoFocus label="写下这件事" onSubmit={(value) => addTask(section.id, value)} onCancel={() => setOpenComposer(null)} />
                ) : (
                  <button className="add-task" onClick={() => setOpenComposer(section.id)}>＋ 添加一件事</button>
                )}
              </article>
            );
          })}
        </section>
      )}
      <footer>今天也不必完美，完成一点就很好。</footer>
    </main>
  );
}

function TaskRow({ task, subtasks, onToggle, onRemove, onAddSubtask }: {
  task: Task;
  subtasks: Task[];
  onToggle: (task: Task) => void;
  onRemove: (task: Task) => void;
  onAddSubtask: (title: string) => void;
}) {
  const [showSubtask, setShowSubtask] = useState(false);
  return (
    <div className={task.completed ? "task done" : "task"}>
      <div className="task-main">
        <button className="check" aria-label={task.completed ? `取消完成：${task.title}` : `完成：${task.title}`} onClick={() => onToggle(task)}>{task.completed ? "✓" : ""}</button>
        <span className="task-title">{task.title}</span>
        <button className="small-action" onClick={() => setShowSubtask((value) => !value)}>子任务</button>
        <DeleteAction label={task.title} onConfirm={() => onRemove(task)} />
      </div>
      {!!subtasks.length && <div className="subtasks">
        {subtasks.map((child) => (
          <div className={child.completed ? "subtask done" : "subtask"} key={child.id}>
            <button className="mini-check" aria-label={child.completed ? `取消完成：${child.title}` : `完成：${child.title}`} onClick={() => onToggle(child)}>{child.completed ? "✓" : ""}</button>
            <span>{child.title}</span>
            <DeleteAction label={child.title} onConfirm={() => onRemove(child)} />
          </div>
        ))}
      </div>}
      {showSubtask && <QuickForm label="添加子任务" onSubmit={(value) => { onAddSubtask(value); setShowSubtask(false); }} onCancel={() => setShowSubtask(false)} />}
    </div>
  );
}

function DeleteAction({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button className="small-action remove" type="button" aria-label={`删除：${label}`} onClick={() => setConfirming(true)}>×</button>
    );
  }

  return (
    <span className="delete-confirm" role="group" aria-label={`确认删除：${label}`}>
      <button className="confirm-delete" type="button" onClick={onConfirm}>确认</button>
      <button className="cancel-delete" type="button" onClick={() => setConfirming(false)}>取消</button>
    </span>
  );
}

function QuickForm({ label, onSubmit, onCancel, autoFocus = false }: { label: string; onSubmit: (value: string) => void; onCancel: () => void; autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (value.trim()) onSubmit(value);
  }
  return (
    <form className="quick-form" onSubmit={submit}>
      <input autoFocus={autoFocus} value={value} onChange={(event) => setValue(event.target.value)} placeholder={label} aria-label={label} maxLength={120} />
      <button type="submit" disabled={!value.trim()}>加入</button>
      <button type="button" onClick={onCancel}>取消</button>
    </form>
  );
}

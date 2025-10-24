"use client";

import { useEffect, useMemo, useState } from "react";
import type { TaskDTO } from "@/lib/types";
import {
  KANBAN_ORDER,
  STATUS,
  StatusEnum,
  STATUS_ENUM,
  labelToEnum,
  enumToLabel,
} from "@/lib/status";
import { useRouter } from "next/navigation";

type TaskMap = Record<StatusEnum, TaskDTO[]>;

function groupByStatus(tasks: TaskDTO[]): TaskMap {
  const base: TaskMap = { CANCELLED: [], TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const t of tasks) {
    const st = labelToEnum(t.status) ?? "TODO";
    base[st].push(t);
  }
  return base;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<{
    mode: "create" | "edit";
    task?: TaskDTO;
  } | null>(null);
  const router = useRouter();

  const groups = useMemo(() => groupByStatus(tasks), [tasks]);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/tasks", { cache: "no-store" });
    setLoading(false);
    if (!res.ok) {
      if (res.status === 401) router.push("/login");
      else setErr(await res.text());
      return;
    }
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createTask(input: {
    title: string;
    description: string;
    status: StatusEnum;
  }) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, status: input.status }),
    });
    if (!res.ok) return;
    setOpenForm(null);
    await load();
  }

  async function updateTask(
    id: number,
    input: { title?: string; description?: string; status?: StatusEnum }
  ) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input }),
    });
    if (!res.ok) return;
    setOpenForm(null);
    await load();
  }

  async function updateStatus(id: number, status: StatusEnum) {
    await updateTask(id, { status });
  }

  async function remove(id: number) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="min-h-screen p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <button
          onClick={logout}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Log out
        </button>
      </header>

      <div className="rounded-3xl bg-slate-100 p-4 text-slate-900 shadow-2xl ring-1 ring-white/40">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setOpenForm({ mode: "create" })}
            className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Create
          </button>
          <p className="text-sm text-slate-500">{tasks.length} tasks</p>
        </div>

        {loading ? (
          <p className="p-6 text-center text-slate-500">Loading…</p>
        ) : err ? (
          <p className="p-6 text-center text-red-600">{err}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {KANBAN_ORDER.map((status) => (
              <div
                key={status}
                className="rounded-2xl bg-white p-3 ring-1 ring-slate-200"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {STATUS[status].label}
                  </h3>
                  <span
                    className={`h-2 w-2 rounded-full ${STATUS[status].badge}`}
                  />
                </div>
                <div className="grid gap-2">
                  {groups[status].map((t) => (
                    <article
                      key={t.id}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md"
                      onClick={() => setOpenForm({ mode: "edit", task: t })}
                    >
                      <h4 className="line-clamp-1 font-medium">{t.title}</h4>
                      {t.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {t.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-400">#{t.id}</span>
                        <div className="flex gap-2">
                          <button
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setOpenForm({ mode: "edit", task: t });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              remove(t.id!);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {groups[status].length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-sm text-slate-400">
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slideover [EDIT / NEW] TASK */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenForm(null)}
          />
          <aside className="relative ml-auto h-full w-full max-w-md bg-white p-5 text-slate-900 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {openForm.mode === "create" ? "New task" : "Edit task"}
              </h2>
              <button
                className="rounded-md bg-slate-100 px-2 py-1 text-sm hover:bg-slate-200"
                onClick={() => setOpenForm(null)}
              >
                Close
              </button>
            </div>

            <TaskForm
              task={openForm.task}
              onCancel={() => setOpenForm(null)}
              onSave={async (values) => {
                if (openForm.mode === "create") await createTask(values);
                else await updateTask(openForm.task!.id!, values);
              }}
            />
          </aside>
        </div>
      )}
    </main>
  );
}

function TaskForm({
  task,
  onSave,
  onCancel,
}: {
  task?: TaskDTO;
  onSave: (v: {
    title: string;
    description: string;
    status: StatusEnum;
  }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<StatusEnum>(
    labelToEnum(task?.status) ?? "TODO"
  );
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ title, description, status });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="text-xs font-medium text-slate-500">Title</label>
      <input
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label className="mt-2 text-xs font-medium text-slate-500">
        Description
      </label>
      <textarea
        className="min-h-[100px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label className="mt-2 text-xs font-medium text-slate-500">Status</label>
      <select
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
        value={status}
        onChange={(e) => setStatus(e.target.value as StatusEnum)}
      >
        {STATUS_ENUM.map((s) => (
          <option key={s} value={s}>
            {STATUS[s].label}
          </option>
        ))}
      </select>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          disabled={saving}
          type="submit"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          className="rounded-lg bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

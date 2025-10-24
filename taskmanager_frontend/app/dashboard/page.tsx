"use client";

import { useEffect, useState } from "react";
import type { TaskDTO } from "@/lib/types";
import { STATUS_ENUM } from "@/lib/status";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

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

  async function createTask(formData: FormData) {
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const status = String(formData.get("status") || "TODO"); // enum
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
    });
    if (res.ok) load();
  }

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
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
    <main style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <section style={{ marginTop: 16 }}>
        <h2>Nueva tarea</h2>
        <form
          action={createTask}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr auto",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input name="title" placeholder="Título" required />
          <input name="description" placeholder="Descripción" />
          <select name="status" defaultValue="TODO">
            {STATUS_ENUM.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit">Añadir</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Mis tareas</h2>
        {loading ? (
          <p>Cargando…</p>
        ) : err ? (
          <p style={{ color: "crimson" }}>{err}</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.status}</td>{" "}
                  {/* valor mostrado ya es label amigable */}
                  <td style={{ display: "flex", gap: 8 }}>
                    <select
                      onChange={(e) => updateStatus(t.id!, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Actualizar estado
                      </option>
                      {STATUS_ENUM.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => remove(t.id!)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

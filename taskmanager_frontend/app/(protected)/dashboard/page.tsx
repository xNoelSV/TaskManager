import { api } from "@/lib/api";

export default async function DashboardPage() {
  const res = await api("/tasks");
  if (!res.ok) {
    return <div>Error while fetching board data.</div>;
  }
  const data = await res.json();

  return <main className="p-6">{/* ...tu tablero kanban con data... */}</main>;
}

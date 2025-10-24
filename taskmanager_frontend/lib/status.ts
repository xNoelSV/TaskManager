// lib/status.ts
export const STATUS = {
  CANCELLED: { key: "CANCELLED", label: "Cancelled", badge: "bg-zinc-500" },
  TODO: { key: "TODO", label: "To Do", badge: "bg-sky-500" },
  IN_PROGRESS: {
    key: "IN_PROGRESS",
    label: "In Progress",
    badge: "bg-amber-500",
  },
  DONE: { key: "DONE", label: "Done", badge: "bg-emerald-500" },
} as const;

export type StatusEnum = keyof typeof STATUS;

export const STATUS_ENUM: StatusEnum[] = [
  "CANCELLED",
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

// The backend responds with "pretty" labels; we normalize -> enum
export function labelToEnum(label?: string): StatusEnum | undefined {
  if (!label) return undefined;
  const l = label.toLowerCase();
  if (l.includes("cancel")) return "CANCELLED";
  if (l.includes("progress")) return "IN_PROGRESS";
  if (l.includes("done")) return "DONE";
  if (l.includes("to do") || l === "todo") return "TODO";
  return undefined;
}

export function enumToLabel(s: StatusEnum) {
  return STATUS[s].label;
}

export const KANBAN_ORDER: StatusEnum[] = [
  "CANCELLED",
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

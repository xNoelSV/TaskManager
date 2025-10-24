export const STATUS_ENUM = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;
export type StatusEnum = (typeof STATUS_ENUM)[number];

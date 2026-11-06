/** Status colors. Each tone maps to the soft fill and the dot in the theme. */
export const statusTones = ["done", "progress", "scheduled", "warning", "danger"] as const;

export type StatusTone = (typeof statusTones)[number];

export const statusPillClass: Record<StatusTone, string> = {
  done: "bg-success-soft text-success-foreground",
  progress: "bg-primary-soft text-primary-ink",
  scheduled: "bg-scheduled-soft text-scheduled-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger-foreground",
};

export const statusDotClass: Record<StatusTone, string> = {
  done: "bg-success",
  progress: "bg-primary",
  scheduled: "bg-scheduled",
  warning: "bg-warning",
  danger: "bg-danger",
};

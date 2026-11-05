import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
  {
    variants: {
      status: {
        done: "bg-success-soft text-success-foreground",
        progress: "bg-primary-soft text-primary-ink",
        scheduled: "bg-scheduled-soft text-scheduled-foreground",
        warning: "bg-warning-soft text-warning-foreground",
        danger: "bg-danger-soft text-danger-foreground",
      },
      size: {
        sm: "h-6 px-2.5 text-asap-xs",
        md: "h-7 px-2.5 text-asap-sm",
      },
    },
    defaultVariants: {
      status: "scheduled",
      size: "sm",
    },
  },
);

const dotClass = {
  done: "bg-success",
  progress: "bg-primary",
  scheduled: "bg-scheduled",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

export type BadgeStatus = NonNullable<VariantProps<typeof badgeVariants>["status"]>;

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Tinted status pills include a dot. Set false for a text-only pill. */
    dot?: boolean;
  };

function Badge({ className, status, size, dot = true, children, ...props }: BadgeProps) {
  const resolved = status ?? "scheduled";
  return (
    <span className={cn(badgeVariants({ status: resolved, size }), className)} {...props}>
      {dot ? (
        <span
          aria-hidden
          data-slot="badge-dot"
          className={cn("size-1.5 shrink-0 rounded-full", dotClass[resolved])}
        />
      ) : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };

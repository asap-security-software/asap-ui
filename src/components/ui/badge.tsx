import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { type StatusTone, statusDotClass, statusPillClass } from "./status-tone";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
  {
    variants: {
      status: statusPillClass,
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

export type BadgeStatus = StatusTone;

export type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Tinted status pills include a dot. Set false for a text-only pill. */
    dot?: boolean;
  };

function Badge({ className, status, size, dot = true, children, ...props }: BadgeProps) {
  const resolved = status ?? "scheduled";
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ status: resolved, size }), className)}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          data-slot="badge-dot"
          className={cn("size-1.5 shrink-0 rounded-full", statusDotClass[resolved])}
        />
      ) : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };

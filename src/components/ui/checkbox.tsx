"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

type CheckboxSize = "md" | "touch";

function Checkbox({
  className,
  size = "md",
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & { size?: CheckboxSize }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group peer inline-flex shrink-0 items-center justify-center rounded-md outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "touch" ? "size-touch" : "size-5",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-5 items-center justify-center rounded-sm border border-border bg-surface text-primary-foreground",
          "group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
          "group-data-[state=indeterminate]:border-primary group-data-[state=indeterminate]:bg-primary",
        )}
      >
        <CheckboxPrimitive.Indicator className="grid place-items-center">
          <Check className="size-3.5 group-data-[state=indeterminate]:hidden" aria-hidden />
          <Minus className="hidden size-3.5 group-data-[state=indeterminate]:block" aria-hidden />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
}

export type { CheckboxSize };
export { Checkbox };

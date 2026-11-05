"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

type SwitchSize = "md" | "touch";

function Switch({
  className,
  size = "md",
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & { size?: SwitchSize }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group peer inline-flex shrink-0 items-center justify-center rounded-full outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "touch" ? "size-touch" : "h-6 w-11",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none flex h-6 w-11 items-center rounded-full border border-border bg-surface-muted p-0.5",
          "transition-colors duration-fast ease-standard motion-reduce:transition-none",
          "group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary",
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block size-5 rounded-full bg-surface shadow-hairline",
            "transition-transform duration-fast ease-standard motion-reduce:transition-none",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        />
      </span>
    </SwitchPrimitive.Root>
  );
}

export type { SwitchSize };
export { Switch };

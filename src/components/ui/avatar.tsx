"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-control",
      lg: "size-control-lg",
      touch: "size-touch",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

function Avatar({
  className,
  size,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-surface-muted text-asap-xs font-semibold text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };

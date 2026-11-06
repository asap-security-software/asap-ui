"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const closeClass =
  "absolute top-3 right-3 inline-flex size-control-lg items-center justify-center rounded-md text-muted transition-colors duration-fast ease-standard hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";

const sheetVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-surface p-5 text-ink shadow-overlay outline-none motion-reduce:animate-none",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-[min(100%,400px)] border-l border-border data-[state=open]:animate-drawer-right",
        left: "inset-y-0 left-0 h-full w-[min(100%,400px)] border-r border-border data-[state=open]:animate-drawer-left",
        bottom:
          "inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t border-border data-[state=open]:animate-drawer-bottom",
        top: "inset-x-0 top-0 max-h-[85vh] rounded-b-xl border-b border-border data-[state=open]:animate-drawer-top",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

function Sheet(props: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal {...props} />;
}

function SheetOverlay({ className, ...props }: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & VariantProps<typeof sheetVariants>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {side === "bottom" ? (
          <div
            aria-hidden
            data-slot="sheet-handle"
            className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border"
          />
        ) : null}
        {children}
        <SheetPrimitive.Close aria-label="Close" className={closeClass}>
          <X className="size-4" aria-hidden />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1 pr-12 text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-asap-xl font-semibold tracking-asap-tight text-ink", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-asap-sm text-muted", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};

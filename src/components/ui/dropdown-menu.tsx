"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "../../lib/utils";

type MenuSize = "md" | "touch";

const MenuSizeContext = createContext<MenuSize>("md");

const itemClass =
  "relative flex cursor-pointer items-center gap-2 rounded-sm px-3 text-asap-sm outline-none select-none focus:bg-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-[0.35]";

function DropdownMenu(props: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal(props: ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

function DropdownMenuTrigger(props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  children,
  sideOffset = 6,
  size = "md",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content> & { size?: MenuSize }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-40 overflow-hidden rounded-md border border-border bg-surface p-1 text-ink shadow-overlay",
          className,
        )}
        {...props}
      >
        <MenuSizeContext.Provider value={size}>{children}</MenuSizeContext.Provider>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup(props: ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "danger";
}) {
  const size = useContext(MenuSizeContext);
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        itemClass,
        size === "touch" ? "min-h-touch px-4 text-asap-md" : "min-h-control-lg",
        inset && "pl-8",
        variant === "danger" && "text-danger focus:bg-danger-soft",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  const size = useContext(MenuSizeContext);
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(
        itemClass,
        size === "touch" ? "min-h-touch pr-3 pl-8" : "min-h-control-lg pr-3 pl-8",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-4" aria-hidden />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  const size = useContext(MenuSizeContext);
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        itemClass,
        size === "touch" ? "min-h-touch pr-3 pl-8" : "min-h-control-lg pr-3 pl-8",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="size-2 rounded-full bg-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn(
        "px-3 py-2 text-asap-2xs font-semibold tracking-asap-eyebrow text-muted uppercase",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-asap-xs tracking-asap-normal text-muted", className)}
      {...props}
    />
  );
}

function DropdownMenuSub(props: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
  const size = useContext(MenuSizeContext);
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        itemClass,
        size === "touch" ? "min-h-touch" : "min-h-control-lg",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 text-muted" aria-hidden />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "z-50 min-w-40 overflow-hidden rounded-md border border-border bg-surface p-1 text-ink shadow-overlay",
        className,
      )}
      {...props}
    />
  );
}

export type { MenuSize };
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};

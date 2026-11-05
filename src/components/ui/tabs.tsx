"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "../../lib/utils";

type TabsSize = "md" | "lg" | "touch";

const TabsSizeContext = createContext<TabsSize>("md");

function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({
  className,
  size = "md",
  ...props
}: ComponentProps<typeof TabsPrimitive.List> & { size?: TabsSize }) {
  return (
    <TabsSizeContext.Provider value={size}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "inline-flex items-center rounded-md bg-surface-muted p-1 text-muted",
          size === "touch" ? "min-h-touch" : size === "lg" ? "min-h-control-lg" : "min-h-control",
          className,
        )}
        {...props}
      />
    </TabsSizeContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const size = useContext(TabsSizeContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex flex-1 items-center justify-center rounded-sm px-3 font-medium whitespace-nowrap text-muted",
        "data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-hairline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "touch"
          ? "min-h-11 text-asap-md"
          : size === "lg"
            ? "h-9 text-asap-sm"
            : "h-7 text-asap-sm",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("mt-3 text-asap-sm text-ink outline-none", className)}
      {...props}
    />
  );
}

export type { TabsSize };
export { Tabs, TabsContent, TabsList, TabsTrigger };

"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { type ComponentProps, createContext, useContext } from "react";
import { cn } from "../../lib/utils";

export type SortDirection = "asc" | "desc";
type TableSize = "dense" | "touch";

const TableSizeContext = createContext<TableSize>("dense");

/** First click sorts ascending. A later click on an ascending column sorts descending. */
export function nextSortDirection(current: SortDirection | false | undefined): SortDirection {
  if (current === "asc") return "desc";
  return "asc";
}

function ariaSortValue(
  sortable: boolean,
  sort: SortDirection | false,
): "ascending" | "descending" | "none" | undefined {
  if (!sortable) return undefined;
  if (sort === "asc") return "ascending";
  if (sort === "desc") return "descending";
  return "none";
}

function SortGlyph({ direction }: { direction: SortDirection | false }) {
  const className = "size-3.5 shrink-0 text-muted";
  if (direction === "asc") return <ChevronUp className={className} aria-hidden />;
  if (direction === "desc") return <ChevronDown className={className} aria-hidden />;
  return <ArrowUpDown className={className} aria-hidden />;
}

function Table({
  className,
  size = "dense",
  ...props
}: ComponentProps<"table"> & { size?: TableSize }) {
  return (
    <TableSizeContext.Provider value={size}>
      <div
        data-slot="table-container"
        data-size={size}
        className="w-full overflow-x-auto rounded-xl border border-border-soft bg-surface"
      >
        <table
          data-slot="table"
          className={cn("w-full caption-bottom border-collapse text-left", className)}
          {...props}
        />
      </div>
    </TableSizeContext.Provider>
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-border-soft bg-surface-muted font-medium", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("border-b border-border-soft last:border-b-0", className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  sortable = false,
  sort = false,
  onSort,
  children,
  scope,
  ...props
}: ComponentProps<"th"> & {
  sortable?: boolean;
  sort?: SortDirection | false;
  onSort?: () => void;
}) {
  const size = useContext(TableSizeContext);
  return (
    <th
      data-slot="table-head"
      scope={scope ?? "col"}
      aria-sort={ariaSortValue(sortable, sort)}
      className={cn(
        "px-3 text-left align-middle text-asap-2xs font-semibold tracking-asap-eyebrow text-muted uppercase",
        size === "touch" ? "h-touch" : "h-9",
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "inline-flex items-center gap-1 rounded-sm font-semibold tracking-asap-eyebrow uppercase",
            "hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            size === "touch" ? "min-h-touch" : "min-h-8",
          )}
        >
          {children}
          <SortGlyph direction={sort} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  const size = useContext(TableSizeContext);
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 align-middle text-ink",
        size === "touch" ? "min-h-touch py-2 text-asap-md" : "py-1.5 text-asap-sm",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-2 text-asap-xs text-muted", className)}
      {...props}
    />
  );
}

export type { TableSize };
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };

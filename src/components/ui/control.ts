import { cva, type VariantProps } from "class-variance-authority";

/** Single-line fields. `lg` is 44px. `touch` is the 52px technician target. */
export const fieldSizes = ["md", "lg", "touch"] as const;
export type FieldSize = (typeof fieldSizes)[number];

export const fieldChrome =
  "w-full border border-border bg-surface font-medium text-ink outline-none placeholder:font-normal placeholder:text-muted-soft transition-colors duration-fast ease-standard focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger motion-reduce:transition-none";

export const fieldControlVariants = cva(fieldChrome, {
  variants: {
    size: {
      md: "h-control rounded-md px-3 text-asap-sm",
      lg: "h-control-lg rounded-md px-3.5 text-asap-md",
      touch: "min-h-touch rounded-lg px-5 text-asap-lg",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export const textareaVariants = cva(`${fieldChrome} block resize-y`, {
  variants: {
    size: {
      md: "min-h-20 rounded-md px-3 py-2 text-asap-sm",
      lg: "min-h-24 rounded-md px-3.5 py-2.5 text-asap-md",
      touch: "min-h-36 rounded-lg px-5 py-3 text-asap-lg",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export type FieldControlVariants = VariantProps<typeof fieldControlVariants>;

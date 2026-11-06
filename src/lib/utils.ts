import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `text-asap-*` is a font size, not a color. Without this, tailwind-merge
 * treats it as a text color and drops `text-success-foreground` on pills.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "asap-2xs",
            "asap-xs",
            "asap-sm",
            "asap-base",
            "asap-md",
            "asap-lg",
            "asap-xl",
            "asap-2xl",
            "asap-3xl",
          ],
        },
      ],
    },
  },
});

/** shadcn class combiner: conditional classes, then Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

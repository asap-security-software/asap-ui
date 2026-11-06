import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { type FieldSize, textareaVariants } from "./control";

export type TextareaProps = ComponentProps<"textarea"> & {
  size?: FieldSize;
};

function Textarea({ className, size = "lg", ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  );
}

export { Textarea };

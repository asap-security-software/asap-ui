import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { type FieldSize, fieldControlVariants } from "./control";

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  size?: FieldSize;
};

function Input({ className, size = "lg", type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldControlVariants({ size }),
        "file:border-0 file:bg-transparent file:font-medium file:text-ink",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

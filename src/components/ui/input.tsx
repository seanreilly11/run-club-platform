import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Input({ className, ...props }: ComponentProps<typeof InputPrimitive>) {
  return (
    <InputPrimitive
      className={cn(
        "w-full rounded-[var(--radius-input)] border border-border bg-[#FFFBF7] px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

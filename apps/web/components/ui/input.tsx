import * as React from "react";

import { cn } from "@/lib/utils";

// Shared size scale — keep in sync with <Button> so fields and buttons align in a row.
const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-base",
} as const;

export type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  size?: keyof typeof sizes;
};

export function Input({ className, type = "text", size = "md", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "w-full min-w-0 rounded-md border border-input bg-card text-foreground transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

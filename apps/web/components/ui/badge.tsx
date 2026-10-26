import * as React from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-muted text-foreground",
  outline: "border-border text-foreground",
} as const;

export type BadgeProps = React.ComponentProps<"span"> & {
  variant?: keyof typeof variants;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium [&>svg]:size-3",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

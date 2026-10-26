import * as React from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border-border bg-card text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-white hover:bg-danger/90",
} as const;

const sizes = {
  sm: "h-7 gap-1.5 px-2.5 text-xs",
  default: "h-8 gap-1.5 px-3 text-sm",
  lg: "h-9 gap-2 px-4 text-sm",
  icon: "size-8",
} as const;

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent font-medium transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

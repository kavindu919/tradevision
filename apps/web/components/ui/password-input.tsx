"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

export type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput({ className, size = "md", ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        type={visible ? "text" : "password"}
        size={size}
        // leave room for the toggle button on the right
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center",
          "text-muted-foreground transition-colors outline-none cursor-pointer",
          "hover:text-foreground focus-visible:text-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
        disabled={props.disabled}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

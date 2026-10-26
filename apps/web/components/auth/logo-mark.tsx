import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-6 text-primary", className)}
      fill="none"
      aria-hidden
    >
      <line
        x1="8"
        y1="4.5"
        x2="8"
        y2="19.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="5.6" y="8.5" width="4.8" height="8" rx="1" fill="currentColor" />
      <line
        x1="16"
        y1="3.5"
        x2="16"
        y2="20.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="13.6"
        y="6.5"
        width="4.8"
        height="7"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/market": "Market",
  "/strategies": "Strategies",
  "/strategies/create": "Create strategy",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  const match = Object.keys(TITLES)
    .filter((href) => pathname.startsWith(href))
    .sort((a, b) => b.length - a.length)[0];
  return match ? TITLES[match] : "TradeVision";
}

export function AppTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
      >
        <Menu />
      </Button>

      <h1 className="text-sm font-semibold text-foreground">
        {titleFor(pathname)}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

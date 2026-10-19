"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CandlestickChart,
  Code2,
  FlaskConical,
  Wallet,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/market", label: "Market", icon: CandlestickChart },
  { href: "/strategies", label: "Strategies", icon: Code2 },
  { href: "/backtests", label: "Backtests", icon: FlaskConical, soon: true },
  { href: "/portfolio", label: "Portfolio", icon: Wallet, soon: true },
  { href: "/community", label: "Community", icon: Users, soon: true },
];

function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 rounded-md px-2 py-1 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="text-brand" aria-hidden="true">
        <svg viewBox="0 0 20 20" className="size-5">
          <path
            d="M6 1.5v3.5M6 13v5.5M14 1v4.5M14 12.5V19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="3.4" y="5" width="5.2" height="8" rx="1" fill="currentColor" />
          <rect
            x="11.4"
            y="5.5"
            width="5.2"
            height="7"
            rx="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </span>
      <span className="text-sm">TradeVision</span>
    </Link>
  );
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  if (item.soon) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground/50"
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/70">
          Soon
        </span>
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className="px-1 pt-1">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5" aria-label="Primary">
        {PRIMARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}

        <div className="mt-auto flex flex-col gap-0.5 pt-4">
          <NavLink
            item={{ href: "/settings", label: "Settings", icon: Settings, soon: true }}
            active={isActive("/settings")}
            onNavigate={onNavigate}
          />
        </div>
      </nav>

      <div className="flex items-center gap-3 rounded-lg border border-border p-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          KJ
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            Kavindu J.
          </p>
          <p className="truncate text-[11px] text-muted-foreground">Free plan</p>
        </div>
        <button
          type="button"
          aria-label="Log out"
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}

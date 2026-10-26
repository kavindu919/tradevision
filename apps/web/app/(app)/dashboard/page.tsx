import Link from "next/link";
import {
  TrendingUp,
  Wallet,
  Code2,
  Activity,
  Plus,
  Play,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STATS = [
  { label: "Portfolio value", value: "—", hint: "No portfolio yet", icon: Wallet },
  { label: "Total return", value: "—", hint: "Run a backtest", icon: TrendingUp },
  { label: "Active strategies", value: "0", hint: "Create your first", icon: Code2 },
  { label: "Backtests run", value: "0", hint: "Last 30 days", icon: Activity },
];

const STEPS = [
  {
    title: "Write a strategy",
    body: "Start from a template or a blank editor. Code runs in an isolated sandbox.",
    href: "/strategies/create",
    cta: "New strategy",
  },
  {
    title: "Backtest it",
    body: "Run it against years of market data and read the results and AI review.",
    href: "/strategies",
    cta: "Go to strategies",
  },
  {
    title: "Watch the market",
    body: "Follow live prices and candlestick charts for the assets you trade.",
    href: "/market",
    cta: "Open market",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back. Here&apos;s where your trading activity will show up.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/strategies">
            <Button variant="outline">
              <Play />
              Run backtest
            </Button>
          </Link>
          <Link href="/strategies/create">
            <Button>
              <Plus />
              New strategy
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="gap-2">
              <div className="flex items-start justify-between px-4">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="px-4">
                <p className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.hint}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 pb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Recent backtests
            </h3>
            <Link
              href="/strategies"
              className="text-xs font-medium text-brand hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Activity className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No backtests yet
            </p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Pick a strategy and a date range to run your first backtest. Its
              results and AI analysis will appear here.
            </p>
            <Link href="/strategies/create" className="mt-2">
              <Button size="sm">
                <Plus />
                Create a strategy
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="border-b border-border px-4 pb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Getting started
            </h3>
          </div>
          <ol className="flex flex-col">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-3 border-b border-border px-4 py-3 last:border-b-0"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.body}
                  </p>
                  <Link
                    href={step.href}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                  >
                    {step.cta}
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/searchbar";
import StrategyFilter from "@/components/strategy/StrategyFilter";
import { Badge } from "@/components/ui/badge";
import { ArchiveRestore, Copy, Pen, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getStrategies } from "@/services/strategy.service";

export type Strategy = {
  id: string;
  name: string;
  asset: string;
  timeframe: string;
  status: "active" | "paused" | "archived";
  version: string;
  updatedAt: string;
  description: string;
};

const Strategy = () => {
  const [strategys, setStrategys] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      setLoading(true);
      try {
        const res = await getStrategies();
        setStrategys(res.data.data.strategies);
      } catch {
        toast.error("Couldn't load strategies");
      } finally {
        setLoading(false);
      }
    };
    fetchStrategies();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground text-balance">
            Strategies
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Design, test and manage your trading strategies.
          </p>
        </div>
        <Link href="/strategies/create">
          <Button size="lg" className="cursor-pointer" disabled={loading}>
            + New strategy
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">
              Total
            </p>
            <p className="text-xl md:text-2xl font-semibold text-foreground">6</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">
              Active
            </p>
            <p className="text-xl md:text-2xl font-semibold text-success">3</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">
              Paused
            </p>
            <p className="text-xl md:text-2xl font-semibold text-warning">2</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all border bg-card border-border">
          <CardContent>
            <p className="text-xs font-medium mb-1 text-muted-foreground">
              Archived
            </p>
            <p className="text-xl md:text-2xl font-semibold text-muted-foreground">1</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:min-w-0 sm:flex-1">
          <SearchBar />
        </div>
        <div className="shrink-0">
          <StrategyFilter />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {strategys.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer transition-all border bg-card border-border min-h-64"
          >
            <CardContent className="flex flex-col h-full  justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                  <section>
                    <p className="text-md font-semibold text-foreground">
                      {item.name}
                    </p>
                  </section>
                  <section
                    className={`border text-xs font-medium mb-1 px-1.5 py-1 ${
                      item.status === "active"
                        ? "text-success bg-success-soft border-success-border"
                        : item.status === "paused"
                          ? "text-warning bg-warning-soft border-warning-border"
                          : "text-muted-foreground bg-muted border-border"
                    }`}
                  >
                    {item.status}
                  </section>
                </div>
                <section className="flex flex-row gap-2">
                  <Badge
                    variant="outline"
                    className="border border-border bg-muted text-xs font-medium mb-1 text-muted-foreground px-1.5 py-1"
                  >
                    {item.asset}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border border-border bg-muted text-xs font-medium mb-1 text-muted-foreground px-1.5 py-1"
                  >
                    {item.timeframe}
                  </Badge>
                </section>
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {item.description}
              </span>
              <section className="flex flex-row  text-xs font-medium text-muted-foreground items-center justify-between w-full">
                <section className="flex flex-row items-center justify-center gap-2">
                  <p>{item.version}</p>
                  <p className="text-muted-foreground/60">{item.updatedAt}</p>
                </section>
                <section className="flex flex-row items-center justify-center gap-2 cursor-pointer">
                  <Pen size={16} />
                  <Copy size={16} />
                  <RotateCcw size={16} />
                  <ArchiveRestore size={16} />
                </section>
              </section>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Strategy;

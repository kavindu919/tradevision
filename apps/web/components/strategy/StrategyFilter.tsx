"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const StrategyFilter = () => {
  const [select, setSelect] = useState<string>("all");
  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <Button
        size="lg"
        className={`cursor-pointer border ${
          select === "all"
            ? "bg-accent text-accent-foreground border-brand"
            : "bg-card text-foreground border-border"
        }`}
        onClick={() => setSelect("all")}
      >
        All
      </Button>
      <Button
        size="lg"
        className={`cursor-pointer border ${
          select === "active"
            ? "bg-accent text-accent-foreground border-brand"
            : "bg-card text-foreground border-border"
        }`}
        onClick={() => setSelect("active")}
      >
        Active
      </Button>
      <Button
        size="lg"
        className={`cursor-pointer border ${
          select === "paused"
            ? "bg-accent text-accent-foreground border-brand"
            : "bg-card text-foreground border-border"
        }`}
        onClick={() => setSelect("paused")}
      >
        Paused
      </Button>
      <Button
        size="lg"
        className={`cursor-pointer border ${
          select === "archived"
            ? "bg-accent text-accent-foreground border-brand"
            : "bg-card text-foreground border-border"
        }`}
        onClick={() => setSelect("archived")}
      >
        Archived
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger variant="outline" size="lg">
          Filter
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setSelect("all")}>All</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSelect("active")}>Active</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setSelect("archived")}>Archived</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StrategyFilter;

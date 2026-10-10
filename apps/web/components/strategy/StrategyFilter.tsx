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
    <div className="flex flex-row items-center gap-2">
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
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer border bg-card text-foreground border-border hover:bg-muted">
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-card border-border text-foreground"
        >
          <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent focus:text-foreground">
            All
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent focus:text-foreground">
            Active
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-transparent focus:bg-transparent focus:text-foreground">
            Archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StrategyFilter;

"use client";
import React, { useState } from "react";

import { DEFAULT_CODE, TIMEFRAMES } from "@/lib/utils";
import { StrategyEditor } from "@/components/strategy/StrategyEditor";

export type StrategyInput = {
  name: string;
  description: string;
  code: string;
  asset_symbol: string;
  timeframe: string;
};

const StrategyCreateForm = () => {
  const [data, setData] = useState<StrategyInput>({
    name: "",
    description: "",
    code: DEFAULT_CODE,
    asset_symbol: "AAPL",
    timeframe: "1h",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCodeChange = (code: string) =>
    setData((prev) => ({ ...prev, code }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background space-y-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-muted-foreground mb-1">
              Strategy Name
            </label>
            <input
              name="name"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              value={data.name}
              onChange={handleChange}
              placeholder="MA Crossover Strategy"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Asset Symbol
            </label>
            <input
              name="asset_symbol"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              value={data.asset_symbol}
              onChange={handleChange}
              placeholder="AAPL"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Timeframe
            </label>
            <select
              name="timeframe"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              value={data.timeframe}
              onChange={handleChange}
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              name="description"
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none"
              rows={2}
              value={data.description}
              onChange={handleChange}
              placeholder="Describe your strategy..."
            />
          </div>
        </div>

        <div className="flex-1" style={{ height: "420px" }}>
          <label className="block text-sm text-muted-foreground mb-1">
            Strategy Logic
          </label>
          <StrategyEditor value={data.code} onChange={handleCodeChange} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="self-end px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-sm font-medium text-primary-foreground rounded-lg transition-colors"
        >
          {loading ? "loading..." : "Create Strategy"}
        </button>
      </div>
    </div>
  );
};
export default StrategyCreateForm;

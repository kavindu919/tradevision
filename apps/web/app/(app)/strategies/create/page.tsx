"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { DEFAULT_CODE, TIMEFRAMES } from "@/lib/utils";
import { StrategyEditor } from "@/components/strategy/StrategyEditor";
import { createStrategy } from "@/services/strategy.service";
import { StrategyTemplate } from "@/lib/strategyTemplates";
import { TemplateGallery } from "@/components/strategy/TemplateGallery";

export type StrategyInput = {
  name: string;
  description: string;
  code: string;
  asset_symbol: string;
  timeframe: string;
};

const StrategyCreateForm = () => {
  const router = useRouter();
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

  const applyTemplate = (e: StrategyTemplate) => {
    setData((prev) => ({
      ...prev,
      name: e.name,
      description: e.description,
      asset_symbol: e.asset_symbol,
      timeframe: e.timeframe,
      code: e.code,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createStrategy(data);
      router.push("/strategies");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Create strategy
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define your strategy and write its trading logic.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted-foreground">
          Start from a template
        </label>
        <TemplateGallery onSelect={applyTemplate} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted-foreground">
            Strategy Name
          </label>
          <input
            name="name"
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={data.name}
            onChange={handleChange}
            placeholder="MA Crossover Strategy"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">
            Asset Symbol
          </label>
          <input
            name="asset_symbol"
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={data.asset_symbol}
            onChange={handleChange}
            placeholder="AAPL"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">
            Timeframe
          </label>
          <select
            name="timeframe"
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted-foreground">
            Description
          </label>
          <textarea
            name="description"
            className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={2}
            value={data.description}
            onChange={handleChange}
            placeholder="Describe your strategy..."
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted-foreground">
          Strategy Logic
        </label>
        <div className="h-115">
          <StrategyEditor value={data.code} onChange={handleCodeChange} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push("/strategies")}
          className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !data.name.trim()}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
        >
          {loading ? "Creating…" : "Create Strategy"}
        </button>
      </div>
    </div>
  );
};

export default StrategyCreateForm;

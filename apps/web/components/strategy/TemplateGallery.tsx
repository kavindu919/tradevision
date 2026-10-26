"use client";
import {
  STRATEGY_TEMPLATES,
  type StrategyTemplate,
} from "@/lib/strategyTemplates";

interface TemplateGalleryProps {
  onSelect: (template: StrategyTemplate) => void;
}

const TAG_COLORS: Record<string, string> = {
  trend: "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
  oscillator:
    "bg-violet-500/15 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  "mean-reversion":
    "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  beginner: "bg-muted text-muted-foreground",
  intermediate:
    "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
};
export const TemplateGallery = ({ onSelect }: TemplateGalleryProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STRATEGY_TEMPLATES.map((template) => (
        <button
          key={template.id}
          className="text-left cursor-pointer p-4 rounded-xl border border-border bg-card hover:bg-muted hover:border-brand transition-all group"
          onClick={() => onSelect(template)}
        >
          <div className="font-medium text-foreground group-hover:text-brand transition-colors mb-1">
            {template.name}
          </div>
          <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {template.description}
          </div>
          <div className="flex flex-wrap gap-1">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-muted text-muted-foreground"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};

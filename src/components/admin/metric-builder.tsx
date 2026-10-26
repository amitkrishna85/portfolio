"use client";

import * as React from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";

export interface CaseMetric {
  label: string;
  value: string;
  unit?: string;
  before?: string;
  after?: string;
}

const PRESET_KPIS = [
  { label: "Unplanned Downtime", value: "32", unit: "%", before: "High incident rate", after: "Pre-empted failures" },
  { label: "MTTR Reduction", value: "45", unit: "%", before: "42 min avg triage", after: "23 min guided fix" },
  { label: "OEE Improvement", value: "14", unit: "%", before: "68% baseline", after: "82% optimized" },
  { label: "Energy Consumption", value: "18", unit: "% saved", before: "Peak continuous load", after: "Dynamic setpoint dispatch" },
  { label: "Telemetry Ingestion", value: "2.5M", unit: "events/sec", before: "Hourly batches", after: "Sub-second stream" },
  { label: "Connected Assets", value: "120k", unit: "nodes", before: "Isolated islands", after: "Unified twin graph" },
  { label: "Platform SLA Uptime", value: "99.99", unit: "%", before: "Frequent outages", after: "Zero safety incidents" },
];

interface MetricBuilderProps {
  metrics: CaseMetric[];
  onChange: (metrics: CaseMetric[]) => void;
}

export function MetricBuilder({ metrics, onChange }: MetricBuilderProps) {
  const handleAdd = () => {
    onChange([...metrics, { label: "", value: "", unit: "" }]);
  };

  const handleApplyPreset = (preset: CaseMetric) => {
    onChange([...metrics, { ...preset }]);
  };

  const handleUpdate = (idx: number, field: keyof CaseMetric, val: string) => {
    const next = [...metrics];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    const next = [...metrics];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Industrial KPI Metrics & Outcomes
          </label>
          <span className="text-[11px] text-muted-foreground">
            Quantify impact with before/after comparisons and benchmark KPIs
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Metric</span>
        </button>
      </div>

      {/* Preset buttons */}
      <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Quick Preset Industrial KPIs</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_KPIS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[11px] px-2 py-0.5 rounded bg-card hover:bg-muted border border-border text-foreground transition-colors"
            >
              + {preset.label} ({preset.value} {preset.unit})
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards List */}
      <div className="space-y-3">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg border border-border bg-card/60 space-y-3 relative group"
          >
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive p-1 rounded"
              title="Remove metric"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  Metric Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtime Cut"
                  value={m.label}
                  onChange={(e) => handleUpdate(idx, "label", e.target.value)}
                  className="w-full p-1.5 text-xs rounded border border-border bg-background"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 32"
                  value={m.value}
                  onChange={(e) => handleUpdate(idx, "value", e.target.value)}
                  className="w-full p-1.5 text-xs rounded border border-border bg-background"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  Unit / Suffix
                </label>
                <input
                  type="text"
                  placeholder="e.g. % or events/sec"
                  value={m.unit || ""}
                  onChange={(e) => handleUpdate(idx, "unit", e.target.value)}
                  className="w-full p-1.5 text-xs rounded border border-border bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  Before State (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frequent trips, 42 min MTTR"
                  value={m.before || ""}
                  onChange={(e) => handleUpdate(idx, "before", e.target.value)}
                  className="w-full p-1.5 text-xs rounded border border-border bg-background text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                  After State / Result (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Predictive pre-emption, 23 min MTTR"
                  value={m.after || ""}
                  onChange={(e) => handleUpdate(idx, "after", e.target.value)}
                  className="w-full p-1.5 text-xs rounded border border-border bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

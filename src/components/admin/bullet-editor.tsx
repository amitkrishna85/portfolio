"use client";

import * as React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface BulletEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  label?: string;
  description?: string;
}

const ACTION_VERBS = [
  "architected",
  "scaled",
  "led",
  "championed",
  "engineered",
  "spearheaded",
  "directed",
  "delivered",
  "automated",
  "integrated",
  "cut",
  "reduced",
  "increased",
  "built",
  "designed",
  "modernized",
  "deployed",
  "standardized",
  "orchestrated",
  "formed",
  "slashed",
  "mentored",
  "accelerated",
  "drove",
  "established",
  "streamlined",
];

export function BulletEditor({
  bullets,
  onChange,
  label = "Role Achievements & Bullets",
  description = "Format: Action verb + what + scale/tech + measurable industrial outcome.",
}: BulletEditorProps) {
  const handleAdd = () => {
    onChange([...bullets, ""]);
  };

  const handleRemove = (index: number) => {
    const next = [...bullets];
    next.splice(index, 1);
    onChange(next);
  };

  const handleUpdate = (index: number, val: string) => {
    const next = [...bullets];
    next[index] = val;
    onChange(next);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bullets.length) return;
    const next = [...bullets];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  };

  const analyzeBullet = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
    const hasActionVerb = ACTION_VERBS.includes(firstWord || "");

    const hasMetric =
      /\d+/.test(trimmed) ||
      /%|\$|m msg|k\+|uptime|sla|latency|oee|mttr|mtbf/i.test(trimmed) ||
      /\[add/i.test(trimmed);

    return {
      hasActionVerb,
      hasMetric,
      isStrong: hasActionVerb && hasMetric,
    };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Bullet</span>
        </button>
      </div>

      {bullets.length === 0 ? (
        <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
          No bullets added yet. Click &quot;Add Bullet&quot; above to add role achievements.
        </div>
      ) : (
        <div className="space-y-3">
          {bullets.map((bullet, idx) => {
            const analysis = analyzeBullet(bullet);

            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-card/50 space-y-2 transition-all hover:border-primary/40"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-muted-foreground pt-2 select-none w-5 text-right">
                    {idx + 1}.
                  </span>
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleUpdate(idx, e.target.value)}
                    placeholder="e.g. Architected unified OPC UA telemetry platform streaming 2.5M events/sec, slashing downtime by 28%..."
                    className="flex-1 p-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y"
                  />
                  <div className="flex flex-col gap-1 pt-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 hover:bg-muted"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === bullets.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 hover:bg-muted"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 rounded text-destructive hover:bg-destructive/10"
                      title="Remove bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Live hints */}
                {analysis && (
                  <div className="flex flex-wrap items-center gap-2 pl-7 text-[11px]">
                    {analysis.isStrong ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Executive formula: Strong verb + quantified outcome
                      </span>
                    ) : (
                      <>
                        {!analysis.hasActionVerb && (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Tip: Start with a strong action verb (e.g. Architected, Scaled, Spearheaded)
                          </span>
                        )}
                        {!analysis.hasMetric && (
                          <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            Tip: Quantify outcome (e.g. [ADD: 28% downtime reduction], 2.5M msg/s)
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { Activity, Zap, CheckCircle2 } from "lucide-react";

interface ImpactMetricItem {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  order: number;
}

export function ImpactSection({ metrics }: { metrics: ImpactMetricItem[] }) {
  if (metrics.length === 0) return null;

  return (
    <section id="impact" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Industrial Engineering Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Proven Scale & Measurable Outcomes
          </h2>
        </div>
        <p className="text-xs text-muted-foreground sm:max-w-xs sm:text-right">
          Track record across global manufacturing, offshore energy, and distributed edge IoT networks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {metrics.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-xl border border-border bg-card/70 backdrop-blur-xs flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all hover:shadow-xs group"
          >
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {item.value}
                </span>
                {item.suffix && (
                  <span className="text-base sm:text-lg font-bold text-primary font-mono">
                    {item.suffix}
                  </span>
                )}
              </div>
              <h3 className="text-xs font-bold text-foreground mt-1 line-clamp-1">
                {item.label}
              </h3>
            </div>

            {item.description && (
              <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 pt-1 border-t border-border/50">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

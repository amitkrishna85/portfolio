"use client";

import * as React from "react";

export interface ArchitectureLayer {
  name: string;
  nodes: string[];
}

interface ArchitectureSvgProps {
  layers: ArchitectureLayer[];
  title?: string;
  className?: string;
}

export function ArchitectureSvg({
  layers,
  title = "Industrial Edge-to-Cloud Digital Twin Reference Architecture",
  className = "",
}: ArchitectureSvgProps) {
  const [activeLayer, setActiveLayer] = React.useState<number | null>(null);

  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-border/80 gap-2">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-foreground tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">
            End-to-end telemetry pipeline from plant floor controllers to cloud 3D simulation
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span>Bi-directional State Sync</span>
        </div>
      </div>

      <div className="min-w-[650px] space-y-3 relative">
        {/* Left Side Rail: Industrial Security IEC 62443 */}
        <div className="hidden lg:block absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-primary via-emerald-500 to-primary/40 opacity-70" title="Cross-cutting IEC 62443 Security Layer" />

        {layers.map((layer, idx) => {
          const isActive = activeLayer === idx;
          const isFaded = activeLayer !== null && !isActive;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveLayer(idx)}
              onMouseLeave={() => setActiveLayer(null)}
              className={`p-3.5 rounded-lg border transition-all duration-200 cursor-default ${
                isActive
                  ? "border-primary bg-primary/10 shadow-md transform scale-[1.01]"
                  : isFaded
                  ? "border-border/40 opacity-50 bg-background/50"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-mono font-bold">
                    T{idx + 1}
                  </span>
                  <span className="text-xs font-bold tracking-tight text-foreground uppercase">
                    {layer.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Tier {idx + 1} of {layers.length}
                </span>
              </div>

              {/* Node Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {layer.nodes.map((node, nodeIdx) => (
                  <div
                    key={nodeIdx}
                    className="p-2 rounded-md bg-card border border-border/80 text-[11px] font-mono font-medium text-foreground text-center truncate shadow-2xs hover:border-primary/60 transition-colors"
                  >
                    {node}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Cross-cutting Security & Observability Footer */}
        <div className="mt-4 p-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Cross-Cutting Foundation:</span>
            <span>Zero-Trust IEC 62443 OT Security</span>
            <span>•</span>
            <span>Full-Stack OpenTelemetry & SRE</span>
          </div>
          <span className="text-[10px] font-mono text-primary font-semibold">
            Deterministic High-Availability SLA
          </span>
        </div>
      </div>
    </div>
  );
}

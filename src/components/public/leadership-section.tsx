import * as React from "react";
import { Compass, Lightbulb, CheckCircle2 } from "lucide-react";

interface LeadershipItem {
  id: string;
  title: string;
  description: string;
  example: string | null;
  order: number;
}

export function LeadershipSection({ principles }: { principles: LeadershipItem[] }) {
  if (principles.length === 0) return null;

  return (
    <section id="leadership" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Management Ethos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Leadership Philosophy & Org Scaling
        </h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          Core principles guiding how I mentor managers, align product-engineering squads, and
          maintain rigorous operational safety standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {principles.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-foreground tracking-tight">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>

            {p.example && (
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs space-y-1">
                <span className="font-semibold text-foreground flex items-center gap-1 text-[11px] text-primary">
                  <Lightbulb className="w-3.5 h-3.5" /> Applied Plant Execution:
                </span>
                <p className="text-muted-foreground leading-relaxed">{p.example}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import {
  Cpu,
  Factory,
  Network,
  Activity,
  Bot,
  Workflow,
  ShieldCheck,
  Flame,
  Zap,
  FlaskConical,
  Mountain,
  Anchor,
  Cog,
  Layers,
} from "lucide-react";

interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

interface IndustryItem {
  id: string;
  name: string;
  description: string;
  iconKey: string;
}

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Network,
  Activity,
  Bot,
  Workflow,
  ShieldCheck,
  Factory,
  Flame,
  Zap,
  FlaskConical,
  Mountain,
  Anchor,
  Cog,
};

export function SolutionsSection({
  capabilities,
  industries,
  integrations,
}: {
  capabilities: CapabilityItem[];
  industries: IndustryItem[];
  integrations: IntegrationItem[];
}) {
  return (
    <section id="solutions" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-16">
      {/* 1. Solution Capabilities */}
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Core Engineering Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Industrial Solutions & Digital Twin Architecture
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Platforms engineered to bridge sub-second plant control reality with scalable cloud
            intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap) => {
            const IconComponent = ICON_MAP[cap.icon] || Cpu;

            return (
              <div
                key={cap.id}
                className="p-6 rounded-xl border border-border bg-card/70 shadow-xs space-y-3 transition-all hover:border-primary/50 hover:shadow-sm group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block font-mono">
                    {cap.category}
                  </span>
                  <h3 className="font-bold text-base text-foreground mt-0.5">{cap.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{cap.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Target Industry Verticals */}
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Factory className="w-3.5 h-3.5" />
            <span>Operational Domains</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Asset-Intensive Industry Verticals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((ind) => {
            const IconComponent = ICON_MAP[ind.iconKey] || Factory;

            return (
              <div
                key={ind.id}
                className="p-5 rounded-xl border border-border bg-card/50 flex items-start gap-4 transition-all hover:border-primary/40"
              >
                <div className="p-2.5 rounded-lg bg-muted text-primary flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground">{ind.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ind.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Integration Ecosystem (Protocols, Systems, Standards, Cloud) */}
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Connectivity & Ecosystem Standards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Industrial Integration Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { cat: "PROTOCOL", title: "Protocols & Connectivity" },
            { cat: "SYSTEM", title: "Plant-Floor Systems (SCADA / MES / Historians)" },
            { cat: "STANDARD", title: "Industrial Standards & Cybersecurity" },
            { cat: "CLOUD", title: "Cloud & Digital Twin Frameworks" },
          ].map(({ cat, title }) => {
            const items = integrations.filter((i) => i.category === cat);

            return (
              <div key={cat} className="p-5 rounded-xl border border-border bg-card/60 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item.id}
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-background text-foreground border border-border shadow-2xs"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

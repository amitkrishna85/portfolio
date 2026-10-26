"use client";

import * as React from "react";
import { ArchitectureSvg, ArchitectureLayer } from "@/components/shared/architecture-svg";
import { Network, Shield, Eye, Layers } from "lucide-react";
import Image from "next/image";

interface ArchitectureSectionProps {
  diagram: {
    id: string;
    title: string;
    description: string;
    layers: ArchitectureLayer[];
    svgOrImageUrl?: string | null;
  } | null;
}

export function ArchitectureSection({ diagram }: ArchitectureSectionProps) {
  if (!diagram || diagram.layers.length === 0) return null;

  return (
    <section id="architecture" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <Network className="w-3.5 h-3.5" />
          <span>Platform Blueprint</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Industrial Digital Twin Reference Architecture
        </h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          {diagram.description ||
            "Production multi-tier architecture connecting field sensors, edge runtimes, distributed streaming, semantic ontologies, and real-time operational copilots."}
        </p>
      </div>

      {/* Interactive Architecture SVG Renderer */}
      <ArchitectureSvg layers={diagram.layers} title={diagram.title} />

      {/* Uploaded Graphic Alternate (if present) */}
      {diagram.svgOrImageUrl && (
        <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Layers className="w-4 h-4 text-primary" />
            <span>High-Resolution System Diagram</span>
          </div>
          <div className="relative w-full aspect-[16/9] max-h-[500px] rounded-lg overflow-hidden border border-border bg-muted">
            <Image
              src={diagram.svgOrImageUrl}
              alt={diagram.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}

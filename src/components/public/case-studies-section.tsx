import * as React from "react";
import Link from "next/link";
import { FolderGit2, ArrowRight, Shield, Activity, ExternalLink } from "lucide-react";
import { CaseMetric } from "@/components/admin/metric-builder";

interface CaseStudyPreview {
  id: string;
  slug: string;
  title: string;
  summary: string;
  industry: string;
  customerName: string;
  anonymizeCustomer: boolean;
  customerAlias: string | null;
  metrics: CaseMetric[];
  techStack: string[];
  featured: boolean;
}

export function CaseStudiesSection({ caseStudies }: { caseStudies: CaseStudyPreview[] }) {
  if (caseStudies.length === 0) return null;

  return (
    <section id="work" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Flagship Industrial Software Deliveries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Featured STAR Case Studies
          </h2>
        </div>
        <p className="text-xs text-muted-foreground sm:max-w-xs sm:text-right">
          In-depth architectural post-mortems and verifiable customer ROI metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {caseStudies.map((study) => {
          const clientDisplay = study.anonymizeCustomer
            ? study.customerAlias || "Confidential Enterprise Client"
            : study.customerName;

          return (
            <div
              key={study.id}
              className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between space-y-5 transition-all hover:border-primary/50 hover:shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-mono">
                    {study.industry}
                  </span>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate max-w-[200px]">{clientDisplay}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/work/${study.slug}`}>{study.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {study.summary}
                </p>

                {/* KPI Outcome Callout Chips */}
                {study.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {study.metrics.slice(0, 3).map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-muted/40 border border-border/80 text-center"
                      >
                        <div className="text-base sm:text-lg font-extrabold font-mono text-primary">
                          {m.value}{m.unit}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate font-medium">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                  {study.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                  {study.techStack.length > 4 && (
                    <span className="text-[10px] text-muted-foreground font-mono self-center">
                      +{study.techStack.length - 4}
                    </span>
                  )}
                </div>

                <Link
                  href={`/work/${study.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

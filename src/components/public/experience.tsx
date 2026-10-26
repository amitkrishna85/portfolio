"use client";

import * as React from "react";
import { formatDate, calculateTenure } from "@/lib/utils";
import { Briefcase, Building2, Calendar, MapPin, Shield, ChevronDown, ChevronUp } from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  companyUrl: string | null;
  logoUrl: string | null;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  bullets: string[];
  techStack: string[];
  industries: string[];
  anonymizeCompany: boolean;
  companyAlias: string | null;
}

export function ExperienceSection({ experiences }: { experiences: ExperienceItem[] }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    experiences[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Career Progression</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Engineering Leadership Experience
        </h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          Leadership roles scaling engineering managers, multi-team orgs, and mission-critical
          industrial software platforms.
        </p>
      </div>

      <div className="relative border-l-2 border-border/80 ml-3 sm:ml-4 space-y-8">
        {experiences.map((exp) => {
          const tenure = calculateTenure(exp.startDate, exp.endDate);
          const isExpanded = expandedId === exp.id;
          const companyDisplay = exp.anonymizeCompany
            ? exp.companyAlias || "Confidential Industrial Client"
            : exp.company;

          return (
            <div key={exp.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Node */}
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  isExpanded
                    ? "bg-primary border-primary shadow-xs ring-4 ring-primary/20"
                    : "bg-background border-muted-foreground/60 group-hover:border-primary"
                }`}
              />

              <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4 transition-all hover:border-primary/40">
                <div
                  onClick={() => toggleExpand(exp.id)}
                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base sm:text-lg text-foreground">
                        {exp.title}
                      </h3>
                      {exp.anonymizeCompany && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                          <Shield className="w-3 h-3" /> NDA Protected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        {companyDisplay}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                        {tenure && ` (${tenure})`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? "Collapse role details" : "Expand role details"}
                    className="p-1 rounded text-muted-foreground hover:text-foreground self-end sm:self-start"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {exp.summary}
                </p>

                {/* Expanded Bullets */}
                {isExpanded && (
                  <div className="space-y-4 pt-2 border-t border-border/60 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Key Engineering & Operational Achievements
                      </span>
                      <ul className="list-disc list-outside ml-4 text-xs sm:text-sm text-foreground/90 space-y-2">
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} className="leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech & Industries */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted/60 text-foreground border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {exp.industries.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground font-medium">
                          {exp.industries.join(" • ")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

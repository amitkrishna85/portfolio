import * as React from "react";
import { Layers, CheckCircle2 } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  level: number | null;
  order: number;
}

interface SkillCategoryItem {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
}

export function SkillsSection({ categories }: { categories: SkillCategoryItem[] }) {
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Technical & Executive Domain Taxonomy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Skills & Technical Expertise
        </h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
          Core competencies developed through decades of architecting industrial automation,
          cloud-native data systems, and leading high-performing engineering squads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-2xl border border-border bg-card/60 shadow-xs space-y-4 hover:border-primary/40 transition-all"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="font-bold text-base text-foreground tracking-tight">{cat.name}</h3>
              <span className="text-[11px] font-mono text-muted-foreground">
                {cat.skills.length} competencies
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cat.skills.map((skill) => {
                const level = skill.level || 5;

                return (
                  <div
                    key={skill.id}
                    className="p-2.5 rounded-lg border border-border/80 bg-background/80 flex items-center justify-between text-xs transition-colors hover:border-primary/50"
                  >
                    <span className="font-medium text-foreground pr-2">{skill.name}</span>
                    <div className="flex items-center gap-0.5 flex-shrink-0" title={`Level ${level}/5`}>
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={`w-1.5 h-1.5 rounded-full ${
                            dot <= level ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

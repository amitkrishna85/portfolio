"use client";

import * as React from "react";
import { updateSectionSettingsAction } from "@/actions/sections";
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, CheckCircle2, RotateCcw } from "lucide-react";

const SECTION_LABELS: Record<string, { label: string; desc: string }> = {
  hero: { label: "1. Hero & Value Proposition", desc: "Digital twin headline, availability badge, resume CTA" },
  impact: { label: "2. Impact at a Glance", desc: "4-6 animated count-up cards (team size, telemetry, downtime)" },
  about: { label: "3. Executive Bio & Target Roles", desc: "Narrative philosophy, target positions, focus industries" },
  solutions: { label: "4. Solutions & Integrations", desc: "OT/IT capabilities, industry verticals, integration matrix" },
  architecture: { label: "5. Platform Architecture", desc: "Interactive 7-tier reference architecture SVG diagram" },
  experience: { label: "6. Career Experience", desc: "Timeline of roles, achievements, tenure, and tech stacks" },
  caseStudies: { label: "7. STAR Case Studies", desc: "Flagship deliveries with KPIs, situation, task, action, result" },
  skills: { label: "8. Skills Taxonomy", desc: "Categorized skills across OT/IT, twins, cloud, and leadership" },
  leadership: { label: "9. Leadership Philosophy", desc: "Core executive management principles & concrete examples" },
  credentials: { label: "10. Education & Certs", desc: "Degrees, cybersecurity licenses (IEC 62443), cloud certs" },
  talks: { label: "11. Talks & Patents", desc: "Conference keynotes, publications, and issued patents" },
  recommendations: { label: "12. Recommendations", desc: "Executive endorsements from VPs, CTOs, and plant directors" },
  contact: { label: "13. Contact & Inquiries", desc: "Secure contact form with rate limits and social links" },
};

const DEFAULT_ORDER = [
  "hero",
  "impact",
  "about",
  "solutions",
  "architecture",
  "experience",
  "caseStudies",
  "skills",
  "leadership",
  "credentials",
  "talks",
  "recommendations",
  "contact",
];

export function SectionsClient({
  initialOrder,
  initialVisibility,
}: {
  initialOrder: string[];
  initialVisibility: Record<string, boolean>;
}) {
  const [order, setOrder] = React.useState<string[]>(
    initialOrder.length > 0 ? initialOrder : DEFAULT_ORDER
  );
  const [visibility, setVisibility] = React.useState<Record<string, boolean>>(initialVisibility);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleMove = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setOrder(next);
  };

  const handleToggleVisible = (key: string) => {
    setVisibility({
      ...visibility,
      [key]: visibility[key] === false ? true : false,
    });
  };

  const handleReset = () => {
    setOrder(DEFAULT_ORDER);
    const vis: Record<string, boolean> = {};
    DEFAULT_ORDER.forEach((k) => (vis[k] = true));
    setVisibility(vis);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    const res = await updateSectionSettingsAction({
      sectionOrder: order,
      sectionVisibility: visibility,
    });
    setIsSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Reorder sections on the public site or toggle sections on/off.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Layout"}</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Section order and visibility updated successfully!</span>
        </div>
      )}

      <div className="space-y-2.5">
        {order.map((key, index) => {
          const info = SECTION_LABELS[key] || { label: key, desc: "" };
          const isVisible = visibility[key] !== false;

          return (
            <div
              key={key}
              className={`p-4 rounded-xl border bg-card flex items-center justify-between gap-4 transition-all ${
                isVisible ? "border-border shadow-2xs" : "border-border/40 opacity-50 bg-background/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-muted text-foreground text-xs font-mono font-bold flex items-center justify-center select-none">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-foreground">{info.label}</h3>
                  <p className="text-[11px] text-muted-foreground">{info.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleVisible(key)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  title={isVisible ? "Hide from public site" : "Show on public site"}
                >
                  {isVisible ? (
                    <Eye className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20"
                  title="Move section up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === order.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20"
                  title="Move section down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

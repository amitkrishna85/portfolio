"use client";

import * as React from "react";
import { updateThemeSettingsAction, dryRunImportAction, executeImportAction } from "@/actions/settings";
import { Palette, Download, Upload, CheckCircle2, AlertTriangle, FileJson, Save, X } from "lucide-react";

const ACCENT_COLORS = [
  { id: "cyan", label: "Industrial Cyan (Telemetry Default)", bg: "bg-cyan-500", text: "text-cyan-500" },
  { id: "emerald", label: "Process Emerald (Sustainable Ops)", bg: "bg-emerald-500", text: "text-emerald-500" },
  { id: "blue", label: "Automation Blue (DCS & SCADA)", bg: "bg-blue-500", text: "text-blue-500" },
  { id: "amber", label: "Maintenance Amber (Plant Alert)", bg: "bg-amber-500", text: "text-amber-500" },
  { id: "slate", label: "Executive Slate (Monochrome)", bg: "bg-slate-500", text: "text-slate-500" },
];

export function SettingsClient({
  currentAccent,
  currentTheme,
}: {
  currentAccent: string;
  currentTheme: string;
}) {
  const [accent, setAccent] = React.useState(currentAccent);
  const [theme, setTheme] = React.useState(currentTheme);
  const [savingTheme, setSavingTheme] = React.useState(false);
  const [themeSaved, setThemeSaved] = React.useState(false);

  // Import state
  const [importJson, setImportJson] = React.useState("");
  const [dryRunResult, setDryRunResult] = React.useState<any | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [importModalOpen, setImportModalOpen] = React.useState(false);

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    setThemeSaved(false);
    const res = await updateThemeSettingsAction(accent, theme);
    setSavingTheme(false);
    if (res.success) {
      setThemeSaved(true);
      document.documentElement.setAttribute("data-accent", accent);
      setTimeout(() => setThemeSaved(false), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setImportJson(content);
      const dryRun = await dryRunImportAction(content);
      setDryRunResult(dryRun);
      setImportModalOpen(true);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    setImporting(true);
    const res = await executeImportAction(importJson);
    setImporting(false);
    if (res.success) {
      alert("Database import complete! The application has been restored.");
      window.location.reload();
    } else {
      alert("Import failed: " + res.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Industrial Accent & Theme */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Theme & Visual Palette</h2>
        </div>

        {themeSaved && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Theme settings updated!</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Primary Industrial Accent
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACCENT_COLORS.map((col) => {
                const isSelected = accent === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setAccent(col.id)}
                    className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${col.bg} flex-shrink-0`} />
                    <span className="text-xs font-medium text-foreground">{col.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveTheme}
              disabled={savingTheme}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingTheme ? "Saving..." : "Save Palette"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Data Backup & Migration (Export / Import) */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <FileJson className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Data Export & Import (JSON)</h2>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Download your full portfolio dataset as structured JSON for offline backups, migration to
          PostgreSQL on Neon/Supabase, or syncing between staging and production.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="/api/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Download Full JSON Export</span>
          </a>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs cursor-pointer">
            <Upload className="w-4 h-4 text-amber-500" />
            <span>Import JSON Backup (with Dry Run)</span>
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Dry Run Modal */}
      {importModalOpen && dryRunResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Dry-Run Import Verification</span>
              </h3>
              <button onClick={() => setImportModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {dryRunResult.success ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  The JSON structure is valid. The following content records will be imported:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-lg border border-border">
                  <div>Profile: {dryRunResult.summary.hasProfile ? "✅ Yes" : "❌ No"}</div>
                  <div>Impact Metrics: {dryRunResult.summary.metricsCount}</div>
                  <div>Career Roles: {dryRunResult.summary.experienceCount}</div>
                  <div>Case Studies: {dryRunResult.summary.caseStudiesCount}</div>
                  <div>Capabilities: {dryRunResult.summary.capabilitiesCount}</div>
                  <div>Industries: {dryRunResult.summary.industriesCount}</div>
                  <div>Integrations: {dryRunResult.summary.integrationsCount}</div>
                  <div>Diagrams: {dryRunResult.summary.diagramsCount}</div>
                  <div>Leadership: {dryRunResult.summary.leadershipCount}</div>
                  <div>Degrees & Certs: {dryRunResult.summary.educationCount + dryRunResult.summary.certificationsCount}</div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                  ⚠️ Note: An automatic checkpoint snapshot will be created before applying changes.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setImportModalOpen(false)}
                    className="px-3 py-1.5 text-xs rounded border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={importing}
                    onClick={handleConfirmImport}
                    className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                  >
                    {importing ? "Importing..." : "Execute Import"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-destructive">
                <p>Validation failed: {dryRunResult.error}</p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setImportModalOpen(false)}
                    className="px-3 py-1.5 rounded border border-border text-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

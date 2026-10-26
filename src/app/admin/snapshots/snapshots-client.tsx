"use client";

import * as React from "react";
import { publishSiteAction, restoreSnapshotAction } from "@/actions/publish";
import { History, Plus, RotateCcw, CheckCircle2, AlertCircle, Calendar, Eye, X } from "lucide-react";

interface SnapshotItem {
  id: string;
  label: string;
  description: string | null;
  data: string;
  createdAt: string | Date;
}

export function SnapshotsClient({ initialSnapshots }: { initialSnapshots: SnapshotItem[] }) {
  const [snapshots, setSnapshots] = React.useState<SnapshotItem[]>(initialSnapshots);
  const [isCreating, setIsCreating] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewData, setPreviewData] = React.useState<any | null>(null);

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await publishSiteAction(label || undefined);
      if (!res.success) throw new Error(res.error);

      setNotification({ type: "success", text: "New snapshot created successfully!" });
      setIsCreating(false);
      setLabel("");
      // Reload page to get new snapshot list
      window.location.reload();
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Failed to create snapshot" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async (snapshot: SnapshotItem) => {
    if (
      !confirm(
        `Are you sure you want to rollback to snapshot "${snapshot.label}" from ${new Date(
          snapshot.createdAt
        ).toLocaleString()}?\n\nThis will restore all content to this snapshot point.`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await restoreSnapshotAction(snapshot.id);
      if (!res.success) throw new Error(res.error);
      alert("Snapshot successfully restored! The site content has been rolled back.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to restore snapshot");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center justify-between ${
            notification.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          <span>{notification.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Every site publish automatically creates a snapshot. You can also create manual checkpoints
          or roll back instantly.
        </p>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>Create Manual Checkpoint</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateSnapshot} className="p-4 rounded-xl border border-primary/40 bg-card/60 flex items-center gap-3">
          <input
            type="text"
            required
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Snapshot Label (e.g. Pre-Interview Version with Cleaned Metrics)"
            className="flex-1 p-2 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Create Snapshot"}
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Snapshot list */}
      <div className="space-y-3">
        {snapshots.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground bg-card/30">
            No snapshots recorded yet. Click &quot;Publish Site&quot; or &quot;Create Manual Checkpoint&quot; to save one.
          </div>
        ) : (
          snapshots.map((snap, idx) => (
            <div
              key={snap.id}
              className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-primary/40"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-foreground">{snap.label}</h3>
                  {idx === 0 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Latest
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-7">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(snap.createdAt).toLocaleString()}</span>
                  {snap.description && <span>• {snap.description}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      setPreviewData(JSON.parse(snap.data));
                    } catch {
                      alert("Invalid snapshot JSON");
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRestore(snap)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                  title="Roll back database to this snapshot"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rollback</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspect Modal */}
      {previewData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Snapshot Data Inspection</h3>
              <button onClick={() => setPreviewData(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <pre className="flex-1 overflow-auto p-4 rounded-lg bg-muted text-[11px] font-mono text-foreground">
              {JSON.stringify(previewData, null, 2)}
            </pre>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="px-4 py-1.5 text-xs rounded bg-muted hover:bg-muted/80 text-foreground font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

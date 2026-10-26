"use client";

import * as React from "react";
import {
  createMetricAction,
  updateMetricAction,
  deleteMetricAction,
  reorderMetricsAction,
} from "@/actions/metrics";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, X, Save, Activity, Sparkles } from "lucide-react";

interface MetricItem {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  order: number;
  visible: boolean;
}

const PRESET_METRICS = [
  { label: "Engineering Org Scaled", value: "45", suffix: "+", description: "Engineers and managers across 5 squads" },
  { label: "Connected Plant Assets", value: "120", suffix: "k+", description: "Rotating equipment & edge nodes" },
  { label: "Ingestion Throughput", value: "2.5", suffix: "M msg/s", description: "Sub-second event streaming" },
  { label: "Unplanned Downtime Cut", value: "28", suffix: "%", description: "Via real-time predictive failure alerts" },
  { label: "Global Enterprise Sites", value: "40", suffix: "+", description: "Refineries & manufacturing plants" },
  { label: "MTTR Reduction", value: "42", suffix: "%", description: "Accelerating triage via twin copilot" },
];

export function MetricsManager({ initialItems }: { initialItems: MetricItem[] }) {
  const [items, setItems] = React.useState<MetricItem[]>(initialItems);
  const [editingItem, setEditingItem] = React.useState<MetricItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [formLabel, setFormLabel] = React.useState("");
  const [formValue, setFormValue] = React.useState("");
  const [formSuffix, setFormSuffix] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formVisible, setFormVisible] = React.useState(true);

  const openCreate = () => {
    setEditingItem(null);
    setFormLabel("");
    setFormValue("");
    setFormSuffix("");
    setFormDescription("");
    setFormVisible(true);
    setIsModalOpen(true);
  };

  const openEdit = (item: MetricItem) => {
    setEditingItem(item);
    setFormLabel(item.label);
    setFormValue(item.value);
    setFormSuffix(item.suffix || "");
    setFormDescription(item.description || "");
    setFormVisible(item.visible);
    setIsModalOpen(true);
  };

  const applyPreset = (preset: typeof PRESET_METRICS[0]) => {
    setFormLabel(preset.label);
    setFormValue(preset.value);
    setFormSuffix(preset.suffix);
    setFormDescription(preset.description);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      label: formLabel,
      value: formValue,
      suffix: formSuffix || null,
      description: formDescription || null,
      visible: formVisible,
    };

    try {
      if (editingItem) {
        const res = await updateMetricAction(editingItem.id, payload);
        if (res.error) throw new Error(res.error);
        setItems(items.map((it) => (it.id === editingItem.id ? { ...it, ...payload } : it)));
      } else {
        const res = await createMetricAction(payload);
        if (res.error) throw new Error(res.error);
        if (res.item) setItems([...items, res.item]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save metric");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete metric "${label}"?`)) return;
    try {
      const res = await deleteMetricAction(id);
      if (res.error) throw new Error(res.error);
      setItems(items.filter((it) => it.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    setItems(reordered);
    await reorderMetricsAction(reordered.map((it) => it.id));
  };

  const handleToggleVisible = async (item: MetricItem) => {
    const updated = !item.visible;
    const res = await updateMetricAction(item.id, {
      label: item.label,
      value: item.value,
      suffix: item.suffix,
      description: item.description,
      visible: updated,
    });
    if (!res.error) {
      setItems(items.map((it) => (it.id === item.id ? { ...it, visible: updated } : it)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Impact cards appear in the &quot;Impact at a Glance&quot; section on the public homepage.
        </p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Impact Metric</span>
        </button>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border bg-card transition-all flex flex-col justify-between ${
              item.visible ? "border-border hover:border-primary/40 shadow-xs" : "border-border/40 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted-foreground">#{index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleVisible(item)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title={item.visible ? "Visible on site" : "Hidden from site"}
                  >
                    {item.visible ? <Eye className="w-3.5 h-3.5 text-emerald-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.label)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  {item.value}
                </span>
                {item.suffix && (
                  <span className="text-xl font-bold text-primary font-mono">{item.suffix}</span>
                )}
              </div>

              <div className="font-semibold text-xs text-foreground mt-1">{item.label}</div>
              {item.description && (
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for create/edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                {editingItem ? "Edit Impact Metric" : "Add Impact Metric"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Presets */}
            {!editingItem && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border/70 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Industrial KPI Presets</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_METRICS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="text-[10px] px-2 py-1 rounded bg-background hover:bg-muted border border-border text-foreground transition-colors"
                    >
                      {preset.label} ({preset.value}{preset.suffix})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Metric Label *
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. Connected Plant Assets"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Value *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="e.g. 120 or 2.5"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Suffix / Unit
                  </label>
                  <input
                    type="text"
                    value={formSuffix}
                    onChange={(e) => setFormSuffix(e.target.value)}
                    placeholder="e.g. k+ or M msg/s or %"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Context / Description
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Rotating equipment across 40 global industrial sites"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="visibleCheckbox"
                  checked={formVisible}
                  onChange={(e) => setFormVisible(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="visibleCheckbox" className="text-xs text-foreground cursor-pointer">
                  Visible on public site
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Metric</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

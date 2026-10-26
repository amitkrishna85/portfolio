"use client";

import * as React from "react";
import { updateArchitectureDiagramAction } from "@/actions/architecture";
import { ArchitectureSvg, ArchitectureLayer } from "@/components/shared/architecture-svg";
import { FileUploader } from "@/components/admin/file-uploader";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, CheckCircle2, AlertCircle, Eye, Edit3 } from "lucide-react";

export function ArchitectureEditor({ initialDiagram }: { initialDiagram: any }) {
  const [title, setTitle] = React.useState(initialDiagram?.title || "Digital Twin Architecture");
  const [description, setDescription] = React.useState(initialDiagram?.description || "");
  const [layers, setLayers] = React.useState<ArchitectureLayer[]>(initialDiagram?.layers || []);
  const [svgOrImageUrl, setSvgOrImageUrl] = React.useState(initialDiagram?.svgOrImageUrl || "");
  const [activeTab, setActiveTab] = React.useState<"form" | "preview">("form");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notification, setNotification] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdateLayerName = (index: number, val: string) => {
    const next = [...layers];
    next[index] = { ...next[index], name: val };
    setLayers(next);
  };

  const handleUpdateLayerNodes = (index: number, val: string) => {
    const next = [...layers];
    next[index] = {
      ...next[index],
      nodes: val.split(",").map((s) => s.trim()).filter(Boolean),
    };
    setLayers(next);
  };

  const handleAddLayer = () => {
    setLayers([...layers, { name: "New Architecture Tier", nodes: ["Component A", "Component B"] }]);
  };

  const handleRemoveLayer = (index: number) => {
    const next = [...layers];
    next.splice(index, 1);
    setLayers(next);
  };

  const handleMoveLayer = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= layers.length) return;
    const next = [...layers];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setLayers(next);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await updateArchitectureDiagramAction(initialDiagram.id, {
        title,
        description,
        layers,
        svgOrImageUrl: svgOrImageUrl || null,
      });

      if (res.error) throw new Error(res.error);
      setNotification({ type: "success", text: "Architecture diagram updated successfully!" });
    } catch (err: any) {
      setNotification({ type: "error", text: err.message || "Failed to update diagram" });
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

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "form" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Layer Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "preview" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Interactive Preview</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {activeTab === "preview" ? (
        <div className="space-y-4">
          <ArchitectureSvg layers={layers} title={title} />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h2 className="text-sm font-bold text-foreground">Diagram Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Diagram Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <FileUploader
                  value={svgOrImageUrl}
                  onChange={setSvgOrImageUrl}
                  accept="image/*"
                  label="Alternative Uploaded Diagram Image (Optional)"
                  description="If provided, users can toggle between the generated interactive diagram and this custom graphic."
                />
              </div>
            </div>
          </div>

          {/* Layers Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Architecture Tiers & Nodes</h2>
              <button
                type="button"
                onClick={handleAddLayer}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-3">
              {layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={layer.name}
                        onChange={(e) => handleUpdateLayerName(idx, e.target.value)}
                        placeholder="Tier Name (e.g. Industrial Edge Tier)"
                        className="w-full p-2 rounded border border-border bg-background text-xs font-bold text-foreground"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveLayer(idx, "up")}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-20"
                        title="Move tier up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === layers.length - 1}
                        onClick={() => handleMoveLayer(idx, "down")}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-20"
                        title="Move tier down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveLayer(idx)}
                        className="p-1.5 rounded text-muted-foreground hover:text-destructive"
                        title="Delete tier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      Nodes in this Tier (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={layer.nodes.join(", ")}
                      onChange={(e) => handleUpdateLayerNodes(idx, e.target.value)}
                      placeholder="e.g. Edge Gateways, Store-and-Forward Cache, OPC UA Adapters"
                      className="w-full p-2 rounded border border-border bg-background text-xs font-mono text-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

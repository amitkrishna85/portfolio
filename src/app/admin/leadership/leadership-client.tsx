"use client";

import * as React from "react";
import { createLeadershipAction, deleteLeadershipAction } from "@/actions/authority";
import { Plus, Trash2, Compass, X } from "lucide-react";

export function LeadershipClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = React.useState(initialItems);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [example, setExample] = React.useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createLeadershipAction({
      title,
      description: desc,
      example: example || null,
    });
    if (res.item) {
      setItems([...items, res.item]);
      setModalOpen(false);
      setTitle("");
      setDesc("");
      setExample("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>Add Principle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 relative group">
            <button
              onClick={async () => {
                if (confirm(`Delete "${item.title}"?`)) {
                  await deleteLeadershipAction(item.id);
                  setItems(items.filter((i) => i.id !== item.id));
                }
              }}
              className="absolute top-4 right-4 p-1 rounded text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground pr-6">{item.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            {item.example && (
              <div className="p-3 rounded-lg bg-muted/40 border border-border/70 text-xs text-muted-foreground/90">
                <span className="font-semibold text-foreground block mb-0.5">Real-World Execution Example:</span>
                {item.example}
              </div>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Leadership Principle</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Principle Title *</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Safety & Determinism First, Speed Second" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description *</label>
                <textarea rows={3} required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Core executive ethos..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Concrete Execution Example</label>
                <textarea rows={2} value={example} onChange={(e) => setExample(e.target.value)} placeholder="How this principle was applied in a real plant / engineering crisis..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Principle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

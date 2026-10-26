"use client";

import * as React from "react";
import { createTalkAction, deleteTalkAction } from "@/actions/authority";
import { Award, Plus, Trash2, ExternalLink, X } from "lucide-react";

export function TalksClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = React.useState(initialItems);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [kind, setKind] = React.useState("TALK");
  const [eventOrPub, setEventOrPub] = React.useState("");
  const [date, setDate] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createTalkAction({
      title,
      kind,
      eventOrPub,
      date,
      url: url || null,
      description: desc || null,
    });
    if (res.item) {
      setItems([...items, res.item]);
      setModalOpen(false);
      setTitle("");
      setEventOrPub("");
      setDate("");
      setUrl("");
      setDesc("");
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
          <span>Add Talk / Patent</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-2 relative group">
            <button
              onClick={async () => {
                if (confirm(`Delete "${item.title}"?`)) {
                  await deleteTalkAction(item.id);
                  setItems(items.filter((i) => i.id !== item.id));
                }
              }}
              className="absolute top-4 right-4 p-1 rounded text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider inline-block">
              {item.kind}
            </span>
            <h3 className="font-bold text-sm text-foreground pr-6">{item.title}</h3>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{item.eventOrPub}</span>
              <span> • {item.date}</span>
            </div>
            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>View Reference</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Talk / Patent / Publication</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Title *</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Scaling Real-Time Digital Twins on Kubernetes" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Type *</label>
                  <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full p-2 text-sm rounded border border-border bg-background">
                    <option value="TALK">Conference Keynote / Talk</option>
                    <option value="PATENT">Patent (Issued / Pending)</option>
                    <option value="PUBLICATION">Whitepaper / Publication</option>
                    <option value="AWARD">Industry Award</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Date (YYYY or YYYY-MM) *</label>
                  <input required type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2024-05" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Event / Publisher / Patent Office *</label>
                <input required type="text" value={eventOrPub} onChange={(e) => setEventOrPub(e.target.value)} placeholder="e.g. Industrial IoT World Summit / USPTO" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">URL (Optional)</label>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
                <textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief summary of key takeaways..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

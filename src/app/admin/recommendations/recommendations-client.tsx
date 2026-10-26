"use client";

import * as React from "react";
import { createRecommendationAction, deleteRecommendationAction } from "@/actions/authority";
import { MessageSquareQuote, Plus, Trash2, ExternalLink, X } from "lucide-react";

export function RecommendationsClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = React.useState(initialItems);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [authorName, setAuthorName] = React.useState("");
  const [authorTitle, setAuthorTitle] = React.useState("");
  const [authorOrg, setAuthorOrg] = React.useState("");
  const [relationship, setRelationship] = React.useState("");
  const [quote, setQuote] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createRecommendationAction({
      authorName,
      authorTitle,
      authorOrg,
      relationship: relationship || null,
      quote,
      linkedinUrl: linkedinUrl || null,
    });
    if (res.item) {
      setItems([...items, res.item]);
      setModalOpen(false);
      setAuthorName("");
      setAuthorTitle("");
      setAuthorOrg("");
      setRelationship("");
      setQuote("");
      setLinkedinUrl("");
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
          <span>Add Recommendation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 relative group">
            <button
              onClick={async () => {
                if (confirm(`Delete recommendation from "${item.authorName}"?`)) {
                  await deleteRecommendationAction(item.id);
                  setItems(items.filter((i) => i.id !== item.id));
                }
              }}
              className="absolute top-4 right-4 p-1 rounded text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-3 pr-6">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                {item.authorName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{item.authorName}</h3>
                <p className="text-xs text-muted-foreground">{item.authorTitle} • {item.authorOrg}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic leading-relaxed pt-1">
              &quot;{item.quote}&quot;
            </p>
            {item.linkedinUrl && (
              <a
                href={item.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>LinkedIn Profile</span>
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
              <h3 className="font-bold text-base text-foreground">Add Recommendation</h3>
              <button onClick={() => setModalOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Author Name *</label>
                <input required type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="e.g. Jane Doe" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Title *</label>
                  <input required type="text" value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} placeholder="VP of Product / CTO" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Organization *</label>
                  <input required type="text" value={authorOrg} onChange={(e) => setAuthorOrg(e.target.value)} placeholder="Company / Enterprise" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Recommendation Quote *</label>
                <textarea rows={4} required value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Amit is an outstanding engineering leader who scaled..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">LinkedIn Profile URL</label>
                <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Recommendation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

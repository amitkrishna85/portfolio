"use client";

import * as React from "react";
import { MarkdownView } from "@/components/shared/markdown-view";
import { Eye, Edit3 } from "lucide-react";

interface MarkdownEditorProps {
  id?: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  description?: string;
}

export function MarkdownEditor({
  id,
  name,
  value,
  onChange,
  placeholder = "Write markdown here...",
  rows = 8,
  label,
  description,
}: MarkdownEditorProps) {
  const [tab, setTab] = React.useState<"write" | "preview">("write");

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id || name} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
          <div className="flex items-center gap-1 border border-border rounded-md p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                tab === "write" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                tab === "preview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}

      {tab === "write" ? (
        <textarea
          id={id || name}
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60 resize-y"
        />
      ) : (
        <div className="p-4 rounded-lg border border-border bg-card/60 min-h-[160px] overflow-y-auto">
          {value.trim() ? (
            <MarkdownView content={value} />
          ) : (
            <span className="text-xs italic text-muted-foreground">No content to preview</span>
          )}
        </div>
      )}

      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
    </div>
  );
}

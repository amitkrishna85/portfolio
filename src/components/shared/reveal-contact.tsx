"use client";

import * as React from "react";
import { Eye, Mail, Phone, Copy, Check } from "lucide-react";

interface RevealContactProps {
  value: string;
  type: "email" | "phone";
  className?: string;
}

export function RevealContact({ value, type, className = "" }: RevealContactProps) {
  const [revealed, setRevealed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!value) return null;

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all hover:border-primary/50 shadow-2xs ${className}`}
      >
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span>Reveal {type === "email" ? "Email Address" : "Phone Number"}</span>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-mono font-medium text-foreground ${className}`}>
      {type === "email" ? <Mail className="w-3.5 h-3.5 text-primary" /> : <Phone className="w-3.5 h-3.5 text-primary" />}
      <a
        href={type === "email" ? `mailto:${value}` : `tel:${value}`}
        className="hover:underline text-foreground"
      >
        {value}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors ml-1"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUp, Shield } from "lucide-react";

export function Footer({ fullName }: { fullName: string }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-card/60 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
              OT
            </div>
            <span className="font-bold text-sm text-foreground">{fullName}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Director of Engineering • Industrial Digital Twin Platforms
          </p>
          <p className="text-[11px] text-muted-foreground/70">
            © {new Date().getFullYear()} {fullName}. Built with Next.js 15, React 19, and Tailwind CSS.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <Link href="/resume" className="hover:text-foreground transition-colors">
            Printable Resume
          </Link>
          <span>•</span>
          <Link href="/admin/login" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-primary" /> Admin Portal
          </Link>
          <span>•</span>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

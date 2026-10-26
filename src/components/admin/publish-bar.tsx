"use client";

import * as React from "react";
import { publishSiteAction } from "@/actions/publish";
import { logoutAction } from "@/actions/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  UploadCloud,
  Eye,
  History,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function PublishBar() {
  const [publishing, setPublishing] = React.useState(false);
  const [lastPublished, setLastPublished] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    setErrorMsg(null);
    try {
      const res = await publishSiteAction();
      if (res.success && res.publishedAt) {
        setLastPublished(res.publishedAt);
      } else if (!res.success) {
        setErrorMsg(res.error || "Failed to publish");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hidden sm:inline">
            Industrial Twin CMS
          </span>
        </div>

        {lastPublished && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Published at {lastPublished}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/admin/preview"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-colors"
          title="Preview site including draft items"
        >
          <Eye className="w-3.5 h-3.5 text-primary" />
          <span>Preview</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          title="Open live public site in new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/admin/snapshots"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          title="Version history & restore"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Snapshots</span>
        </Link>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold shadow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          {publishing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Publish Site</span>
            </>
          )}
        </button>

        <ThemeToggle />

        <form action={logoutAction}>
          <button
            type="submit"
            className="p-2 rounded-md border border-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
            title="Sign out of admin session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
}

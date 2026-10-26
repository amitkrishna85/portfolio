"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { FileDown, Menu, X, Shield, ExternalLink } from "lucide-react";

interface NavbarProps {
  fullName: string;
  resumeUrl?: string | null;
}

const NAV_LINKS = [
  { href: "#impact", label: "Impact" },
  { href: "#about", label: "About" },
  { href: "#solutions", label: "Solutions" },
  { href: "#architecture", label: "Architecture" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Case Studies" },
  { href: "#skills", label: "Skills" },
  { href: "#leadership", label: "Leadership" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ fullName, resumeUrl }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-md shadow-xs"
          : "border-b border-border/40 bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            OT
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-foreground block group-hover:text-primary transition-colors">
              {fullName}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-mono">
              Digital Twin Platforms
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-primary" />
              <span>Resume</span>
            </a>
          ) : (
            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-primary" />
              <span>Resume</span>
            </Link>
          )}

          <ThemeToggle />

          <Link
            href="/admin"
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
            title="Private Admin CMS"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <Link
              href="/resume"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>View Executive Resume</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-medium text-muted-foreground hover:underline"
            >
              Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

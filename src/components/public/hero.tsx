"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FileDown, Linkedin, Mail, Cpu, ShieldCheck, Activity, Layers } from "lucide-react";

interface HeroProps {
  fullName: string;
  headline: string;
  summaryShort: string;
  availabilityStatus: string;
  resumeUrl?: string | null;
  linkedinUrl?: string | null;
}

export function Hero({
  fullName,
  headline,
  summaryShort,
  availabilityStatus,
  resumeUrl,
  linkedinUrl,
}: HeroProps) {
  const isAvailable = availabilityStatus !== "UNAVAILABLE";

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4 sm:px-6">
      {/* Background Animated Plant-to-Cloud Twin Motif */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute w-full h-full opacity-25 dark:opacity-20 text-primary/40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="streamGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
            </pattern>
          </defs>

          {/* Blueprint Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Telemetry Stream Paths (Plant -> Edge -> Cloud Twin) */}
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" className="animate-pulse-slow">
            <path d="M 150 680 C 300 680, 400 450, 600 450" />
            <path d="M 250 720 C 400 720, 500 450, 600 450" />
            <path d="M 600 450 C 750 450, 850 200, 1050 200" />
          </g>

          {/* Plant Floor Sensors (Level 0-2) */}
          <g fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5">
            <rect x="120" y="660" width="60" height="40" rx="6" />
            <rect x="220" y="700" width="60" height="40" rx="6" />
            <circle cx="150" cy="680" r="4" fill="currentColor" />
            <circle cx="250" cy="720" r="4" fill="currentColor" />
          </g>

          {/* Industrial Edge Gateway Node */}
          <g fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2">
            <rect x="550" y="410" width="100" height="80" rx="10" />
            <circle cx="600" cy="450" r="6" fill="currentColor" className="animate-ping" style={{ animationDuration: "3s" }} />
          </g>

          {/* Enterprise Cloud 3D Digital Twin Sphere / Cube */}
          <g fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2">
            <polygon points="1050,150 1120,190 1120,270 1050,230" />
            <polygon points="1050,150 980,190 980,270 1050,230" />
            <polygon points="1050,150 1120,190 1050,230 980,190" fillOpacity="0.3" />
          </g>
        </svg>

        {/* Ambient Radial Vignette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md text-xs font-medium text-foreground shadow-xs">
          <span className="relative flex h-2 w-2">
            {isAvailable && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isAvailable ? "bg-emerald-500" : "bg-muted-foreground"
              }`}
            />
          </span>
          <span className="tracking-wide">
            {isAvailable ? "Open to Leadership Roles • Digital Twin Platforms" : "Engaged"}
          </span>
        </div>

        {/* Candidate Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          {fullName}
        </h1>

        {/* Headline */}
        <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary tracking-tight max-w-3xl mx-auto">
          {headline}
        </p>

        {/* Value Proposition */}
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {summaryShort ||
            "Bridging OT/IT convergence, plant historians, and real-time streaming telemetry into high-fidelity digital twins and predictive APM for asset-intensive operations."}
        </p>

        {/* Domain Proof Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-muted-foreground">
          <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border">
            OT/IT Convergence
          </span>
          <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border">
            OPC UA & MQTT
          </span>
          <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border">
            Distributed Systems & Kafka
          </span>
          <span className="px-2.5 py-1 rounded-md bg-muted/50 border border-border">
            IEC 62443 Security
          </span>
        </div>

        {/* CTAs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          ) : (
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Executive Resume</span>
            </Link>
          )}

          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
            >
              <Linkedin className="w-4 h-4 text-primary" />
              <span>LinkedIn Profile</span>
            </a>
          )}

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span>Contact Me</span>
          </a>
        </div>
      </div>
    </section>
  );
}

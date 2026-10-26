import * as React from "react";
import Image from "next/image";
import { MarkdownView } from "@/components/shared/markdown-view";
import { RevealContact } from "@/components/shared/reveal-contact";
import { Target, Factory, UserCheck, MapPin, Mail, Phone } from "lucide-react";

interface AboutProps {
  fullName: string;
  headline: string;
  location: string;
  aboutLong: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  targetRoles: string[];
  industriesFocus: string[];
}

export function AboutSection({
  fullName,
  headline,
  location,
  aboutLong,
  email,
  phone,
  avatarUrl,
  targetRoles,
  industriesFocus,
}: AboutProps) {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Executive Bio */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Executive Background & Narrative</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              About Amit Krishna
            </h2>
            {location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{location}</span>
              </p>
            )}
          </div>

          <div className="p-6 rounded-xl border border-border bg-card/60 shadow-xs">
            <MarkdownView content={aboutLong} />
          </div>

          {/* Privacy Protected Contact Details */}
          <div className="p-4 rounded-xl border border-border bg-card/40 flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-foreground">Direct Contact:</span>
            <RevealContact value={email} type="email" />
            {phone && <RevealContact value={phone} type="phone" />}
          </div>
        </div>

        {/* Right Column: Target Roles & Focus Verticals */}
        <div className="lg:col-span-4 space-y-6">
          {avatarUrl && (
            <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-border shadow-md">
              <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
            </div>
          )}

          {/* What I'm Looking For Card */}
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Target className="w-4 h-4 text-primary" />
              <h3>Target Positions & Scope</h3>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Target Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {targetRoles.map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-card text-foreground border border-border"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-primary/20">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Industry Verticals Focus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {industriesFocus.map((ind) => (
                  <span
                    key={ind}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-card text-foreground border border-border"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-primary/20">
              Targeting organizations scaling multi-team engineering organizations building
              enterprise digital twin ecosystems, OT/IT convergence, or asset performance management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

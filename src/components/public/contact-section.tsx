"use client";

import * as React from "react";
import { useActionState } from "react";
import { submitContactAction } from "@/actions/contact";
import { RevealContact } from "@/components/shared/reveal-contact";
import { Mail, Send, Linkedin, Github, Globe, CheckCircle2, AlertCircle, Shield } from "lucide-react";

interface ContactSectionProps {
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
}

export function ContactSection({
  email,
  phone,
  linkedinUrl,
  githubUrl,
  websiteUrl,
}: ContactSectionProps) {
  const [state, formAction, isPending] = useActionState(submitContactAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Information & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Communication</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Let&apos;s Connect
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Available for discussions regarding Director / VP of Engineering roles building
              industrial digital twin platforms, edge computing ecosystems, or OT/IT convergence.
            </p>
          </div>

          {/* Protected Channels */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Verified Direct Channels
            </span>
            <div className="flex flex-col gap-2">
              <RevealContact value={email} type="email" />
              {phone && <RevealContact value={phone} type="phone" />}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Online Profiles
            </span>
            <div className="flex flex-wrap gap-2">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
                >
                  <Linkedin className="w-3.5 h-3.5 text-primary" />
                  <span>LinkedIn</span>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5 text-primary" />
                  <span>GitHub</span>
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card/40 flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Spam-protected with honeypot fields & rate limiting</span>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            <h3 className="font-extrabold text-lg text-foreground">
              Send an Inbound Message
            </h3>

            {state?.success && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {state.message || "Thank you! Your message has been received."}
                </span>
              </div>
            )}

            {state?.error && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{state.error}</span>
              </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
              {/* Anti-spam Honeypot Field (hidden from genuine users) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Industrial Enterprise / Executive Search"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Director of Engineering Opportunity"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  placeholder="Details regarding your team, technology stack, or interview schedule..."
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

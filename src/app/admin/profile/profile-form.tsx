"use client";

import * as React from "react";
import { useActionState } from "react";
import { updateProfileAction } from "@/actions/profile";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { FileUploader } from "@/components/admin/file-uploader";
import { Save, CheckCircle2, AlertCircle, User, Briefcase, Globe, FileText, Search } from "lucide-react";

interface ProfileFormProps {
  initialData: any;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);
  const [aboutLong, setAboutLong] = React.useState(initialData?.aboutLong || "");
  const [avatarUrl, setAvatarUrl] = React.useState(initialData?.avatarUrl || "");
  const [resumeUrl, setResumeUrl] = React.useState(initialData?.resumeUrl || "");
  const [ogImageUrl, setOgImageUrl] = React.useState(initialData?.ogImageUrl || "");

  const targetRoles = Array.isArray(initialData?.targetRoles)
    ? initialData.targetRoles.join("\n")
    : "";
  const industriesFocus = Array.isArray(initialData?.industriesFocus)
    ? initialData.industriesFocus.join("\n")
    : "";

  return (
    <form action={formAction} className="space-y-8">
      {/* Notifications */}
      {state?.success && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{state.message || "Profile changes saved!"}</span>
        </div>
      )}
      {state?.error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Primary Identity Section */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/60">
          <User className="w-4 h-4 text-primary" />
          <h2>Identity & Core Positioning</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              defaultValue={initialData?.fullName || "Amit Krishna"}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Availability Status
            </label>
            <select
              name="availabilityStatus"
              defaultValue={initialData?.availabilityStatus || "OPEN_TO_DISCUSS"}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            >
              <option value="OPEN_TO_DISCUSS">Open to Discussion (Active Search)</option>
              <option value="ACTIVELY_LOOKING">Actively Interviewing</option>
              <option value="UNAVAILABLE">Not Currently Available</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Executive Headline *
            </label>
            <input
              type="text"
              name="headline"
              required
              defaultValue={
                initialData?.headline ||
                "Director of Engineering - Industrial Digital Twin Platforms"
              }
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Location / Mobility
            </label>
            <input
              type="text"
              name="location"
              defaultValue={initialData?.location || ""}
              placeholder="e.g. Oslo, Norway / Remote / Hybrid"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Short Summary (&le; 200 chars)
            </label>
            <input
              type="text"
              name="summaryShort"
              maxLength={220}
              defaultValue={initialData?.summaryShort || ""}
              placeholder="One-line elevator pitch for hero and meta tags"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Long Executive About (Markdown) */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/60">
          <FileText className="w-4 h-4 text-primary" />
          <h2>Executive Narrative & Philosophy (Markdown)</h2>
        </div>

        <MarkdownEditor
          name="aboutLong"
          value={aboutLong}
          onChange={setAboutLong}
          rows={10}
          label="Detailed Biography & Operational Thesis"
          description="Rendered in the About section on the public site and accessible to recruiters."
        />
        {/* Hidden input to pass value in form submission */}
        <input type="hidden" name="aboutLong" value={aboutLong} />
      </div>

      {/* Target Roles & Focus Industries */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/60">
          <Briefcase className="w-4 h-4 text-primary" />
          <h2>Target Roles & Domain Focus</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Target Roles (one per line)
            </label>
            <textarea
              name="targetRoles"
              rows={4}
              defaultValue={targetRoles}
              placeholder="Director of Engineering&#10;VP of Engineering&#10;Head of Industrial Platforms"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Industry Focus (one per line)
            </label>
            <textarea
              name="industriesFocus"
              rows={4}
              defaultValue={industriesFocus}
              placeholder="Manufacturing & Discrete Automation&#10;Energy, Oil & Gas&#10;Power Generation & Utilities"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/60">
          <Globe className="w-4 h-4 text-primary" />
          <h2>Contact & Professional Links</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Public Email *
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={initialData?.email || ""}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Protected behind a &quot;Reveal Contact&quot; button on public pages.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={initialData?.phone || ""}
              placeholder="+1-xxx-xxx-xxxx"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              defaultValue={initialData?.linkedinUrl || ""}
              placeholder="https://linkedin.com/in/..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              defaultValue={initialData?.githubUrl || ""}
              placeholder="https://github.com/..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Personal Website URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              defaultValue={initialData?.websiteUrl || ""}
              placeholder="https://..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* File Uploads: Avatar & Resume */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/60">
          <FileText className="w-4 h-4 text-primary" />
          <h2>Media & Resume Document</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploader
            value={avatarUrl}
            onChange={setAvatarUrl}
            accept="image/*"
            label="Executive Avatar / Headshot"
            description="Recommended: Square professional photo (500x500px, max 5MB)"
          />
          <input type="hidden" name="avatarUrl" value={avatarUrl} />

          <FileUploader
            value={resumeUrl}
            onChange={setResumeUrl}
            accept="application/pdf"
            label="Resume Document (PDF)"
            description="Downloadable from the hero section (max 10MB)"
            isPdf={true}
          />
          <input type="hidden" name="resumeUrl" value={resumeUrl} />
        </div>
      </div>

      {/* SEO & Social Card Metadata */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-foreground font-semibold pb-2 border-b border-border/60">
          <Search className="w-4 h-4 text-primary" />
          <h2>SEO & Social Card Metadata</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Custom Page Title
            </label>
            <input
              type="text"
              name="seoTitle"
              defaultValue={initialData?.seoTitle || ""}
              placeholder="Amit Krishna | Director of Engineering - Industrial Digital Twin Platforms"
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Meta Description
            </label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={initialData?.seoDescription || ""}
              placeholder="Executive portfolio of Amit Krishna..."
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <FileUploader
              value={ogImageUrl}
              onChange={setOgImageUrl}
              accept="image/*"
              label="OpenGraph Social Sharing Image (1200x630px)"
              description="Displayed when shared on LinkedIn, Twitter, and messaging apps"
            />
            <input type="hidden" name="ogImageUrl" value={ogImageUrl} />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end sticky bottom-4 z-20">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile & SEO</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import { prisma } from "@/lib/prisma";
import { parseJson, formatDate, calculateTenure } from "@/lib/utils";
import Link from "next/link";
import { Printer, ArrowLeft, Mail, Phone, MapPin, Globe, Linkedin, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Amit Krishna - Director of Engineering",
  description: "Executive printable resume of Amit Krishna, Director of Engineering - Industrial Digital Twin Platforms.",
};

export default async function ResumePage() {
  const [profile, experiences, skills, education, certifications, caseStudies] =
    await Promise.all([
      prisma.profile.findUnique({ where: { id: "singleton" } }),
      prisma.experience.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      }),
      prisma.skillCategory.findMany({
        orderBy: { order: "asc" },
        include: { skills: { orderBy: { order: "asc" } } },
      }),
      prisma.education.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      }),
      prisma.certification.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      }),
      prisma.caseStudy.findMany({
        where: { status: "PUBLISHED", featured: true },
        orderBy: { order: "asc" },
      }),
    ]);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-slate-900">
      {/* Top Floating Action Bar (Hidden when printing) */}
      <div className="max-w-[850px] mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        <button
          onClick={undefined}
          data-print-trigger="true"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow hover:opacity-90 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Script to wire up the print button cleanly without hydration issues */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-print-trigger]')) {
                window.print();
              }
            });
          `,
        }}
      />

      {/* Printable Sheet */}
      <div className="max-w-[850px] mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-neutral-200 print:shadow-none print:border-none print:p-0 space-y-6 text-slate-900 font-sans leading-relaxed">
        {/* Header */}
        <header className="border-b border-slate-300 pb-5 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                {profile?.fullName || "Amit Krishna"}
              </h1>
              <p className="text-sm font-bold text-teal-700 tracking-wide mt-0.5">
                {profile?.headline || "Director of Engineering - Industrial Digital Twin Platforms"}
              </p>
            </div>
            {profile?.location && (
              <div className="text-xs text-slate-600 sm:text-right font-medium">
                {profile.location}
              </div>
            )}
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-2 font-mono">
            {profile?.email && <span>{profile.email}</span>}
            {profile?.phone && <span>• {profile.phone}</span>}
            {profile?.linkedinUrl && (
              <span>
                • <a href={profile.linkedinUrl} className="underline text-slate-700">LinkedIn Profile</a>
              </span>
            )}
            {profile?.websiteUrl && (
              <span>
                • <a href={profile.websiteUrl} className="underline text-slate-700">Portfolio Site</a>
              </span>
            )}
          </div>
        </header>

        {/* Executive Summary */}
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            Executive Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {profile?.summaryShort ||
              "Engineering executive with extensive leadership experience architecting enterprise Industrial Digital Twin platforms. Proven track record leading multi-team organizations, standardizing OT/IT connectivity (OPC UA, MQTT Sparkplug B), and delivering high-availability telemetry pipelines for mission-critical industrial assets."}
          </p>
        </section>

        {/* Core Competencies Matrix */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            Core Competencies & Domain Expertise
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skills.map((cat) => (
              <div key={cat.id} className="text-slate-800">
                <span className="font-bold text-slate-900">{cat.name}: </span>
                <span className="text-slate-600">
                  {cat.skills.map((s) => s.name).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Career Experience */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            Leadership & Engineering Experience
          </h2>

          <div className="space-y-5">
            {experiences.map((exp) => {
              const tenure = calculateTenure(exp.startDate, exp.endDate);
              const companyDisplay = exp.anonymizeCompany
                ? exp.companyAlias || "Confidential Industrial Client"
                : exp.company;
              const bullets = parseJson<string[]>(exp.bullets, []);

              return (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-950 text-sm">{exp.title}</span>
                      <span className="text-slate-700 font-semibold"> • {companyDisplay}</span>
                      {exp.location && <span className="text-slate-500"> ({exp.location})</span>}
                    </div>
                    <div className="font-mono text-slate-600 font-medium">
                      {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      {tenure && ` (${tenure})`}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">{exp.summary}</p>

                  <ul className="list-disc list-outside ml-4 text-xs text-slate-800 space-y-1">
                    {bullets.map((b, i) => (
                      <li key={i} className="leading-snug">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Flagship Case Studies Summary */}
        {caseStudies.length > 0 && (
          <section className="space-y-3 page-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              Key Industrial Deliveries & Business ROI
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {caseStudies.map((study) => {
                const metrics = parseJson<any[]>(study.metrics, []);
                const client = study.anonymizeCustomer
                  ? study.customerAlias || "Confidential"
                  : study.customerName;

                return (
                  <div key={study.id} className="p-3 rounded border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="font-bold text-slate-900 line-clamp-1">{study.title}</div>
                    <div className="text-[11px] text-teal-800 font-semibold">{client} • {study.industry}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{study.result}</p>
                    {metrics.length > 0 && (
                      <div className="text-[11px] font-mono font-bold text-slate-800 pt-1">
                        ROI: {metrics.map((m) => `${m.label} (${m.value}${m.unit})`).join(" • ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education & Certifications */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            Education & Certifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Education</span>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="font-semibold text-slate-800">{edu.degree} - {edu.field}</div>
                  <div className="text-slate-600">{edu.institution} {edu.startDate && `(${edu.startDate} - ${edu.endDate})`}</div>
                </div>
              ))}
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">Certifications & Licenses</span>
              {certifications.map((cert) => (
                <div key={cert.id} className="space-y-0.5">
                  <div className="font-semibold text-slate-800">{cert.name}</div>
                  <div className="text-slate-600">{cert.issuer} • Issued {cert.issueDate}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

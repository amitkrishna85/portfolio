import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  CheckCircle2,
  Calendar,
  Building,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({
    where: { slug },
  });

  if (!study) return { title: "Case Study Not Found" };

  return {
    title: `${study.title} | Case Study`,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      images: study.coverImageUrl ? [study.coverImageUrl] : undefined,
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [study, profile, allStudies] = await Promise.all([
    prisma.caseStudy.findUnique({
      where: { slug },
    }),
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  if (!study || (study.status !== "PUBLISHED")) {
    notFound();
  }

  const metrics = parseJson<any[]>(study.metrics, []);
  const techStack = parseJson<string[]>(study.techStack, []);
  const links = parseJson<any[]>(study.links, []);

  // Compute prev/next
  const currentIndex = allStudies.findIndex((s) => s.slug === slug);
  const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null;

  const clientName = study.anonymizeCustomer
    ? study.customerAlias || "Confidential Enterprise Client"
    : study.customerName;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar fullName={profile?.fullName || "Amit Krishna"} resumeUrl={profile?.resumeUrl} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Back Link */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio Overview</span>
        </Link>

        {/* Case Study Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-mono">
              {study.industry}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Client: {clientName}</span>
              {study.anonymizeCustomer && (
                <span className="text-[10px] text-muted-foreground italic">(NDA Protected)</span>
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {study.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {study.summary}
          </p>
        </div>

        {/* Key Metrics Banner */}
        {metrics.length > 0 && (
          <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Activity className="w-4 h-4" />
              <span>Verifiable Industrial KPI Outcomes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-card/90 shadow-2xs space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-primary">
                    {m.value}{m.unit}
                  </div>
                  <div className="font-bold text-xs text-foreground">{m.label}</div>
                  {(m.before || m.after) && (
                    <div className="pt-2 border-t border-border/50 text-[11px] space-y-0.5 text-muted-foreground">
                      {m.before && <div>Before: {m.before}</div>}
                      {m.after && <div className="text-foreground font-medium">After: {m.after}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAR Methodology Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Executive STAR Engineering Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Situation */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono block">
                S • Situation & Operational Context
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {study.situation}
              </p>
            </div>

            {/* Task */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono block">
                T • Task & Engineering Charter
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {study.task}
              </p>
            </div>

            {/* Action */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono block">
                A • Action & Platform Execution
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {study.action}
              </p>
            </div>

            {/* Result */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono block">
                R • Result & Measurable Business ROI
              </span>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {study.result}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Architecture Image (if attached) */}
        {study.architectureImageUrl && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">System Architecture Graphic</h2>
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-muted">
              <Image
                src={study.architectureImageUrl}
                alt="System Architecture"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="p-6 rounded-xl border border-border bg-card/50 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Technologies & Frameworks Utilized
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-md text-xs font-mono font-medium bg-background text-foreground border border-border shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Next / Previous Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-border">
          {prevStudy ? (
            <Link
              href={`/work/${prevStudy.slug}`}
              className="p-4 rounded-xl border border-border bg-card hover:bg-muted text-left space-y-1 transition-all flex-1"
            >
              <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Previous Case Study
              </div>
              <div className="font-bold text-sm text-foreground line-clamp-1">
                {prevStudy.title}
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextStudy && (
            <Link
              href={`/work/${nextStudy.slug}`}
              className="p-4 rounded-xl border border-border bg-card hover:bg-muted text-right space-y-1 transition-all flex-1"
            >
              <div className="text-[11px] font-semibold text-muted-foreground flex items-center justify-end gap-1">
                Next Case Study <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-sm text-foreground line-clamp-1">
                {nextStudy.title}
              </div>
            </Link>
          )}
        </div>
      </main>

      <Footer fullName={profile?.fullName || "Amit Krishna"} />
    </div>
  );
}

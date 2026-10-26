import { prisma } from "@/lib/prisma";
import { calculatePortfolioCompleteness } from "@/lib/completeness";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Eye,
  Activity,
  Briefcase,
  FolderGit2,
  Cpu,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    profile,
    metricsCount,
    experiencesCount,
    caseStudiesCount,
    skillsCount,
    unreadMessagesCount,
    latestSnapshot,
    completeness,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    prisma.impactMetric.count(),
    prisma.experience.count(),
    prisma.caseStudy.count(),
    prisma.skill.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.siteSnapshot.findFirst({ orderBy: { createdAt: "desc" } }),
    calculatePortfolioCompleteness(),
  ]);

  // Compute 7-day and 30-day views
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [views7d, views30d] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Industrial Executive CMS • Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome, {profile?.fullName || "Amit Krishna"}. Managing portfolio for{" "}
            <span className="text-primary font-medium">{profile?.headline}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/preview"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Open Preview</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow hover:opacity-90"
          >
            <span>Live Public Site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Completeness Score</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {completeness.score}%
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completeness.score}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Unread Inquiries</span>
            <Mail className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {unreadMessagesCount}
          </div>
          <Link
            href="/admin/messages"
            className="text-xs text-primary hover:underline block pt-1"
          >
            Manage inbox →
          </Link>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Views (7d / 30d)</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground font-mono">
            {views7d} <span className="text-xs text-muted-foreground font-normal">/ {views30d}</span>
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            Cookie-less, privacy-preserving telemetry
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Last Snapshot</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-semibold text-foreground truncate pt-2">
            {latestSnapshot ? new Date(latestSnapshot.createdAt).toLocaleDateString() : "Pending"}
          </div>
          <Link
            href="/admin/snapshots"
            className="text-xs text-primary hover:underline block pt-1"
          >
            Version history →
          </Link>
        </div>
      </div>

      {/* Unresolved Placeholders "Needs Your Input" */}
      <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-foreground">
              Needs Your Input • Unresolved Markers ({completeness.placeholders.length})
            </h2>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Directly mapped from seed/content.json
          </span>
        </div>

        {completeness.placeholders.length === 0 ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            ✅ All personal placeholders resolved! No pending [ADD: ...] markers found in database.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {completeness.placeholders.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{item.section}:</span>
                    <span className="text-muted-foreground">{item.field}</span>
                  </div>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-medium">
                    {item.placeholder}
                  </span>
                </div>
                <Link
                  href={item.actionUrl}
                  className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-foreground font-semibold self-start sm:self-center text-[11px] transition-colors"
                >
                  Edit Field →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio Readiness Checklist */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Recruiter Readiness Checklist
        </h2>
        <div className="space-y-3">
          {completeness.checklist.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-lg border border-border bg-background/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.passed ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground bg-muted"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">{item.label}</h3>
                  <p className="text-[11px] text-muted-foreground">{item.description}</p>
                </div>
              </div>

              <Link
                href={item.actionUrl}
                className="text-xs text-primary font-medium hover:underline flex-shrink-0"
              >
                Configure →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

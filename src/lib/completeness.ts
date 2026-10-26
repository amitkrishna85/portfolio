import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  actionUrl: string;
}

export interface PlaceholderItem {
  section: string;
  field: string;
  placeholder: string;
  actionUrl: string;
}

export function computeScore(passedCount: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((passedCount / total) * 100);
}

export function scanPlaceholders(text: string | null | undefined): string[] {
  if (!text) return [];
  const matches = text.match(/\[ADD:[^\]]+\]/g) || text.match(/\[PASTE[^\]]*\]/g);
  return matches ? Array.from(matches) : [];
}

export async function calculatePortfolioCompleteness() {
  const [
    profile,
    metrics,
    experiences,
    caseStudies,
    industries,
    integrations,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    prisma.impactMetric.findMany(),
    prisma.experience.findMany(),
    prisma.caseStudy.findMany(),
    prisma.industryVertical.findMany(),
    prisma.integrationItem.findMany(),
  ]);

  const checklist: ChecklistItem[] = [
    {
      id: "headline",
      label: "Executive Headline & Positioning",
      description: "Director of Engineering Industrial Digital Twin headline specified",
      passed: !!profile?.headline && !profile.headline.includes("[ADD"),
      actionUrl: "/admin/profile",
    },
    {
      id: "metrics",
      label: "Impact Metrics (\u2265 3 items)",
      description: "At least 3 quantified scale / outcome metrics configured",
      passed: metrics.length >= 3,
      actionUrl: "/admin/metrics",
    },
    {
      id: "experience",
      label: "Career Roles (\u2265 2 roles with \u2265 3 bullets)",
      description: "Career trajectory with quantified action-verb bullets",
      passed:
        experiences.length >= 2 &&
        experiences.every((exp) => parseJson<string[]>(exp.bullets, []).length >= 3),
      actionUrl: "/admin/experience",
    },
    {
      id: "casestudy",
      label: "Flagship Case Study with STAR Layout",
      description: "At least 1 in-depth industrial case study published",
      passed: caseStudies.length >= 1,
      actionUrl: "/admin/case-studies",
    },
    {
      id: "industries",
      label: "Industry Verticals & Integrations Matrix",
      description: "Target sectors and industrial connectivity items filled",
      passed: industries.length >= 3 && integrations.length >= 6,
      actionUrl: "/admin/solutions",
    },
    {
      id: "resume",
      label: "Executive Resume Uploaded",
      description: "PDF version of candidate resume attached",
      passed: !!profile?.resumeUrl,
      actionUrl: "/admin/profile",
    },
    {
      id: "seo",
      label: "SEO Title & Meta Description",
      description: "Recruiter search-engine tags configured",
      passed: !!profile?.seoTitle && !!profile?.seoDescription,
      actionUrl: "/admin/profile",
    },
  ];

  const passedCount = checklist.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checklist.length) * 100);

  // Scan for unresolved [ADD: ...] placeholders
  const placeholders: PlaceholderItem[] = [];

  const checkText = (text: string | null | undefined, section: string, field: string, url: string) => {
    if (!text) return;
    const matches = text.match(/\[ADD:[^\]]+\]/g) || text.match(/\[PASTE[^\]]*\]/g);
    if (matches) {
      matches.forEach((m) => {
        placeholders.push({
          section,
          field,
          placeholder: m,
          actionUrl: url,
        });
      });
    }
  };

  if (profile) {
    checkText(profile.location, "Profile", "Location", "/admin/profile");
    checkText(profile.aboutLong, "Profile", "About Narrative", "/admin/profile");
    checkText(profile.phone, "Profile", "Phone", "/admin/profile");
  }

  experiences.forEach((exp) => {
    checkText(exp.company, "Experience", `${exp.title} - Company`, "/admin/experience");
    checkText(exp.location, "Experience", `${exp.title} - Location`, "/admin/experience");
    const bullets = parseJson<string[]>(exp.bullets, []);
    bullets.forEach((b, i) => {
      checkText(b, "Experience", `${exp.title} - Bullet #${i + 1}`, "/admin/experience");
    });
  });

  caseStudies.forEach((cs) => {
    checkText(cs.customerName, "Case Studies", `${cs.title} - Customer Name`, "/admin/case-studies");
    checkText(cs.situation, "Case Studies", `${cs.title} - Situation`, "/admin/case-studies");
    checkText(cs.task, "Case Studies", `${cs.title} - Task`, "/admin/case-studies");
    checkText(cs.action, "Case Studies", `${cs.title} - Action`, "/admin/case-studies");
    checkText(cs.result, "Case Studies", `${cs.title} - Result`, "/admin/case-studies");
  });

  return {
    score,
    checklist,
    placeholders,
  };
}

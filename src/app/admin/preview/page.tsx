import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { PublicPortfolio } from "@/components/public/public-portfolio";

export default async function AdminPreviewPage() {
  const [
    profile,
    impactMetrics,
    experiences,
    caseStudies,
    solutionCapabilities,
    industryVerticals,
    integrationItems,
    architectureDiagram,
    skillCategories,
    leadershipPrinciples,
    recommendations,
    talks,
    education,
    certifications,
    siteSettings,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "singleton" } }),
    prisma.impactMetric.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.caseStudy.findMany({ orderBy: { order: "asc" } }),
    prisma.solutionCapability.findMany({ orderBy: { order: "asc" } }),
    prisma.industryVertical.findMany({ orderBy: { order: "asc" } }),
    prisma.integrationItem.findMany({ orderBy: { order: "asc" } }),
    prisma.architectureDiagram.findFirst({ where: { kind: "REFERENCE" } }),
    prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        skills: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.leadershipPrinciple.findMany({ orderBy: { order: "asc" } }),
    prisma.recommendation.findMany({ orderBy: { order: "asc" } }),
    prisma.talk.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const parsedData = {
    profile: profile
      ? {
          ...profile,
          targetRoles: parseJson<string[]>(profile.targetRoles, []),
          industriesFocus: parseJson<string[]>(profile.industriesFocus, []),
        }
      : null,
    impactMetrics,
    experience: experiences.map((e) => ({
      ...e,
      bullets: parseJson<string[]>(e.bullets, []),
      techStack: parseJson<string[]>(e.techStack, []),
      industries: parseJson<string[]>(e.industries, []),
    })),
    caseStudies: caseStudies.map((c) => ({
      ...c,
      metrics: parseJson<any[]>(c.metrics, []),
      techStack: parseJson<string[]>(c.techStack, []),
      links: parseJson<any[]>(c.links, []),
    })),
    solutionCapabilities,
    industryVerticals,
    integrationItems,
    architectureDiagram: architectureDiagram
      ? {
          ...architectureDiagram,
          layers: parseJson<any[]>(architectureDiagram.layers, []),
        }
      : null,
    skillCategories,
    leadershipPrinciples,
    recommendations,
    talks,
    education: education.map((edu) => ({
      ...edu,
      highlights: parseJson<string[]>(edu.highlights, []),
    })),
    certifications,
    sectionOrder: parseJson<string[]>(siteSettings?.sectionOrder, []),
    sectionVisibility: parseJson<Record<string, boolean>>(siteSettings?.sectionVisibility, {}),
  };

  return <PublicPortfolio data={parsedData} isPreview={true} />;
}

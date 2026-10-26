import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { PublicPortfolio } from "@/components/public/public-portfolio";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({
    where: { id: "singleton" },
  });

  const title =
    profile?.seoTitle ||
    `${profile?.fullName || "Amit Krishna"} | ${profile?.headline || "Director of Engineering"}`;
  const description =
    profile?.seoDescription ||
    profile?.summaryShort ||
    "Executive portfolio of Amit Krishna, Director of Engineering building Industrial Digital Twin Platforms.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile?.ogImageUrl ? [profile.ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
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
    prisma.impactMetric.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.experience.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.caseStudy.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.solutionCapability.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.industryVertical.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.integrationItem.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.architectureDiagram.findFirst({
      where: { status: "PUBLISHED", visible: true, kind: "REFERENCE" },
    }),
    prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        skills: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.leadershipPrinciple.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.recommendation.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.talk.findMany({
      where: { status: "PUBLISHED", visible: true },
      orderBy: { order: "asc" },
    }),
    prisma.education.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
    prisma.certification.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    }),
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

  return <PublicPortfolio data={parsedData} isPreview={false} />;
}

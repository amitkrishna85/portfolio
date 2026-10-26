import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      profile,
      impactMetrics,
      experience,
      caseStudies,
      solutionCapabilities,
      industryVerticals,
      integrationItems,
      architectureDiagrams,
      skillCategories,
      skills,
      leadershipPrinciples,
      recommendations,
      talks,
      education,
      certifications,
      siteSettings,
    ] = await Promise.all([
      prisma.profile.findUnique({ where: { id: "singleton" } }),
      prisma.impactMetric.findMany(),
      prisma.experience.findMany(),
      prisma.caseStudy.findMany(),
      prisma.solutionCapability.findMany(),
      prisma.industryVertical.findMany(),
      prisma.integrationItem.findMany(),
      prisma.architectureDiagram.findMany(),
      prisma.skillCategory.findMany(),
      prisma.skill.findMany(),
      prisma.leadershipPrinciple.findMany(),
      prisma.recommendation.findMany(),
      prisma.talk.findMany(),
      prisma.education.findMany(),
      prisma.certification.findMany(),
      prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    ]);

    const exportData = {
      exportVersion: "1.0",
      exportedAt: new Date().toISOString(),
      profile,
      impactMetrics,
      experience,
      caseStudies,
      solutionCapabilities,
      industryVerticals,
      integrationItems,
      architectureDiagrams,
      skillCategories,
      skills,
      leadershipPrinciples,
      recommendations,
      talks,
      education,
      certifications,
      siteSettings,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="industrial-twin-portfolio-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

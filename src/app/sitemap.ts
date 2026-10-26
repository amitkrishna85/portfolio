import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://amitkrishna.industrial-twin.dev";

  // Fetch only published and visible case studies
  const caseStudies = await prisma.caseStudy.findMany({
    where: { status: "PUBLISHED", visible: true },
    select: { slug: true, updatedAt: true },
  });

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...caseStudies.map((cs) => ({
      url: `${baseUrl}/work/${cs.slug}`,
      lastModified: cs.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];

  return routes;
}

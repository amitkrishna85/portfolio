import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://amitkrishna.industrial-twin.dev";

  const staticRoutes: MetadataRoute.Sitemap = [
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
  ];

  try {
    // Fetch only published and visible case studies
    const caseStudies = await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED", visible: true },
      select: { slug: true, updatedAt: true },
    });

    const dynamicRoutes: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
      url: `${baseUrl}/work/${cs.slug}`,
      lastModified: cs.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    console.warn("⚠️ Warning: Failed to fetch dynamic entries for sitemap. Returning static routes only.");
    return staticRoutes;
  }
}

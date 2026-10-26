import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://amitkrishna.industrial-twin.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/resume", "/work/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

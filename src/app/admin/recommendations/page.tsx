import { prisma } from "@/lib/prisma";
import { RecommendationsClient } from "./recommendations-client";

export default async function AdminRecommendationsPage() {
  const recommendations = await prisma.recommendation.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Executive Recommendations & Testimonials
        </h1>
        <p className="text-sm text-muted-foreground">
          Showcase leadership endorsements from VPs of Engineering, plant directors, and executive
          peers.
        </p>
      </div>

      <RecommendationsClient initialItems={recommendations} />
    </div>
  );
}

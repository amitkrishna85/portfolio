import { prisma } from "@/lib/prisma";
import { SolutionsManager } from "./solutions-manager";

export default async function AdminSolutionsPage() {
  const [capabilities, industries, integrations] = await Promise.all([
    prisma.solutionCapability.findMany({ orderBy: { order: "asc" } }),
    prisma.industryVertical.findMany({ orderBy: { order: "asc" } }),
    prisma.integrationItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Industrial Solutions, Verticals & Integrations
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your core domain capabilities, target industries, and the industrial connectivity
          matrix (Protocols, Plant Systems, Standards, and Cloud Ecosystems).
        </p>
      </div>

      <SolutionsManager
        capabilities={capabilities}
        industries={industries}
        integrations={integrations}
      />
    </div>
  );
}

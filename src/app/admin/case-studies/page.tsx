import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { CaseStudiesManager } from "./case-studies-manager";

export default async function AdminCaseStudiesPage() {
  const caseStudies = await prisma.caseStudy.findMany({
    orderBy: { order: "asc" },
  });

  const parsed = caseStudies.map((c) => ({
    ...c,
    metrics: parseJson<any[]>(c.metrics, []),
    techStack: parseJson<string[]>(c.techStack, []),
    links: parseJson<any[]>(c.links, []),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          STAR Case Studies & Flagship Deliveries
        </h1>
        <p className="text-sm text-muted-foreground">
          Structure complex industrial engineering achievements using the Situation, Task, Action,
          Result framework with verifiable KPI metrics and NDA customer protection.
        </p>
      </div>

      <CaseStudiesManager initialItems={parsed} />
    </div>
  );
}

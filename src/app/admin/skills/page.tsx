import { prisma } from "@/lib/prisma";
import { SkillsManager } from "./skills-manager";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: {
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Industrial Skills & Domain Taxonomy
        </h1>
        <p className="text-sm text-muted-foreground">
          Categorize technical competencies across OT/IT convergence, digital twins, platform
          engineering, and executive leadership.
        </p>
      </div>

      <SkillsManager initialCategories={categories} />
    </div>
  );
}

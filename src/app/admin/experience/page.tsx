import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { ExperienceManager } from "./experience-manager";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  const parsed = experiences.map((item) => ({
    ...item,
    bullets: parseJson<string[]>(item.bullets, []),
    techStack: parseJson<string[]>(item.techStack, []),
    industries: parseJson<string[]>(item.industries, []),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Career Experience & Leadership Roles
        </h1>
        <p className="text-sm text-muted-foreground">
          Document your career trajectory, scale of organizations managed, OT/IT initiatives, and
          measurable industrial ROI.
        </p>
      </div>

      <ExperienceManager initialItems={parsed} />
    </div>
  );
}

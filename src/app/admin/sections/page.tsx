import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { SectionsClient } from "./sections-client";

export default async function AdminSectionsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  const order = parseJson<string[]>(settings?.sectionOrder, []);
  const visibility = parseJson<Record<string, boolean>>(settings?.sectionVisibility, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Section Order & Visibility Manager
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize the layout structure of the public portfolio. Drag or move sections to prioritize
          case studies, architecture diagrams, or leadership principles for specific hiring managers.
        </p>
      </div>

      <SectionsClient initialOrder={order} initialVisibility={visibility} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { TalksClient } from "./talks-client";

export default async function AdminTalksPage() {
  const talks = await prisma.talk.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Keynotes, Publications, Patents & Awards
        </h1>
        <p className="text-sm text-muted-foreground">
          Highlight industry authority signals, conference talks on digital twins, issued patents,
          and peer-reviewed publications.
        </p>
      </div>

      <TalksClient initialItems={talks} />
    </div>
  );
}

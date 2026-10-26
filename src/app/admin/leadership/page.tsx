import { prisma } from "@/lib/prisma";
import { LeadershipClient } from "./leadership-client";

export default async function AdminLeadershipPage() {
  const principles = await prisma.leadershipPrinciple.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leadership Philosophy & Management Principles
        </h1>
        <p className="text-sm text-muted-foreground">
          Articulate your executive leadership ethos across hiring, org scaling, high-trust autonomy,
          and OT/IT operational safety.
        </p>
      </div>

      <LeadershipClient initialItems={principles} />
    </div>
  );
}

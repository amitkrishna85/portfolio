import { prisma } from "@/lib/prisma";
import { SnapshotsClient } from "./snapshots-client";

export default async function AdminSnapshotsPage() {
  const snapshots = await prisma.siteSnapshot.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Version History & Database Snapshots
        </h1>
        <p className="text-sm text-muted-foreground">
          Audit every published state, restore previous portfolio iterations, and create manual
          checkpoints prior to major content revisions.
        </p>
      </div>

      <SnapshotsClient initialSnapshots={snapshots} />
    </div>
  );
}

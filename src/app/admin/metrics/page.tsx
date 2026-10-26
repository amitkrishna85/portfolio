import { prisma } from "@/lib/prisma";
import { MetricsManager } from "./metrics-manager";

export default async function AdminMetricsPage() {
  const metrics = await prisma.impactMetric.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Global Impact Metrics
        </h1>
        <p className="text-sm text-muted-foreground">
          Quantify your executive industrial software impact with metrics like team size, connected
          assets, telemetry throughput, and downtime reductions.
        </p>
      </div>

      <MetricsManager initialItems={metrics} />
    </div>
  );
}

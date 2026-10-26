"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createMetricAction(data: {
  label: string;
  value: string;
  suffix?: string | null;
  description?: string | null;
  visible?: boolean;
}) {
  await requireAdminSession();

  try {
    const highest = await prisma.impactMetric.findFirst({
      orderBy: { order: "desc" },
    });
    const nextOrder = (highest?.order ?? 0) + 1;

    const created = await prisma.impactMetric.create({
      data: {
        label: data.label,
        value: data.value,
        suffix: data.suffix || null,
        description: data.description || null,
        order: nextOrder,
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/metrics");

    return { success: true, item: created };
  } catch (error: any) {
    console.error("Create metric error:", error);
    return { error: error.message || "Failed to create metric." };
  }
}

export async function updateMetricAction(
  id: string,
  data: {
    label: string;
    value: string;
    suffix?: string | null;
    description?: string | null;
    visible?: boolean;
  }
) {
  await requireAdminSession();

  try {
    const updated = await prisma.impactMetric.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        suffix: data.suffix,
        description: data.description,
        visible: data.visible,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/metrics");

    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Update metric error:", error);
    return { error: error.message || "Failed to update metric." };
  }
}

export async function deleteMetricAction(id: string) {
  await requireAdminSession();

  try {
    await prisma.impactMetric.delete({ where: { id } });

    revalidatePath("/", "layout");
    revalidatePath("/admin/metrics");

    return { success: true };
  } catch (error: any) {
    console.error("Delete metric error:", error);
    return { error: error.message || "Failed to delete metric." };
  }
}

export async function reorderMetricsAction(metricIds: string[]) {
  await requireAdminSession();

  try {
    await prisma.$transaction(
      metricIds.map((id, index) =>
        prisma.impactMetric.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/", "layout");
    revalidatePath("/admin/metrics");

    return { success: true };
  } catch (error: any) {
    console.error("Reorder metrics error:", error);
    return { error: error.message || "Failed to reorder metrics." };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function updateArchitectureDiagramAction(
  id: string,
  data: {
    title: string;
    description: string;
    layers: { name: string; nodes: string[] }[];
    svgOrImageUrl?: string | null;
  }
) {
  await requireAdminSession();

  try {
    const updated = await prisma.architectureDiagram.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        layers: JSON.stringify(data.layers),
        svgOrImageUrl: data.svgOrImageUrl || null,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/architecture");

    return { success: true, item: updated };
  } catch (err: any) {
    return { error: err.message || "Failed to update architecture diagram" };
  }
}

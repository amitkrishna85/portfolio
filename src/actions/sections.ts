"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function updateSectionSettingsAction(data: {
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
}) {
  await requireAdminSession();

  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        sectionOrder: JSON.stringify(data.sectionOrder),
        sectionVisibility: JSON.stringify(data.sectionVisibility),
      },
      create: {
        id: "singleton",
        sectionOrder: JSON.stringify(data.sectionOrder),
        sectionVisibility: JSON.stringify(data.sectionVisibility),
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/sections");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update section settings" };
  }
}

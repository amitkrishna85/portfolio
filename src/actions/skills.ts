"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createSkillCategoryAction(name: string) {
  await requireAdminSession();
  try {
    const highest = await prisma.skillCategory.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const cat = await prisma.skillCategory.create({ data: { name, order } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/skills");
    return { success: true, item: cat };
  } catch (err: any) {
    return { error: err.message || "Failed to create skill category" };
  }
}

export async function deleteSkillCategoryAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.skillCategory.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete skill category" };
  }
}

export async function createSkillAction(categoryId: string, name: string, level = 5) {
  await requireAdminSession();
  try {
    const highest = await prisma.skill.findFirst({
      where: { categoryId },
      orderBy: { order: "desc" },
    });
    const order = (highest?.order ?? 0) + 1;
    const skill = await prisma.skill.create({
      data: { name, level, categoryId, order },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/skills");
    return { success: true, item: skill };
  } catch (err: any) {
    return { error: err.message || "Failed to create skill" };
  }
}

export async function updateSkillAction(id: string, name: string, level: number) {
  await requireAdminSession();
  try {
    const updated = await prisma.skill.update({
      where: { id },
      data: { name, level },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/skills");
    return { success: true, item: updated };
  } catch (err: any) {
    return { error: err.message || "Failed to update skill" };
  }
}

export async function deleteSkillAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete skill" };
  }
}

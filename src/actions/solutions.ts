"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// Solution Capabilities
export async function createCapabilityAction(data: {
  title: string;
  description: string;
  icon?: string;
  category: string;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.solutionCapability.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const item = await prisma.solutionCapability.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon || "Cpu",
        category: data.category,
        order,
      },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/solutions");
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message || "Failed to create capability" };
  }
}

export async function deleteCapabilityAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.solutionCapability.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/solutions");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete capability" };
  }
}

// Industry Verticals
export async function createIndustryAction(data: {
  name: string;
  description: string;
  iconKey?: string;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.industryVertical.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const item = await prisma.industryVertical.create({
      data: {
        name: data.name,
        description: data.description,
        iconKey: data.iconKey || "Factory",
        order,
      },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/solutions");
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message || "Failed to create industry" };
  }
}

export async function deleteIndustryAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.industryVertical.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/solutions");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete industry" };
  }
}

// Integrations
export async function createIntegrationAction(data: { name: string; category: string }) {
  await requireAdminSession();
  try {
    const highest = await prisma.integrationItem.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const item = await prisma.integrationItem.create({
      data: {
        name: data.name,
        category: data.category,
        order,
      },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/solutions");
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message || "Failed to create integration" };
  }
}

export async function deleteIntegrationAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.integrationItem.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/solutions");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete integration" };
  }
}

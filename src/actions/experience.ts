"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createExperienceAction(data: {
  company: string;
  companyUrl?: string;
  logoUrl?: string;
  title: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  summary: string;
  bullets: string[];
  techStack: string[];
  industries: string[];
  anonymizeCompany?: boolean;
  companyAlias?: string | null;
  status?: string;
  visible?: boolean;
}) {
  await requireAdminSession();

  try {
    const highest = await prisma.experience.findFirst({
      orderBy: { order: "desc" },
    });
    const nextOrder = (highest?.order ?? 0) + 1;

    const created = await prisma.experience.create({
      data: {
        company: data.company,
        companyUrl: data.companyUrl || null,
        logoUrl: data.logoUrl || null,
        title: data.title,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate || null,
        summary: data.summary,
        bullets: JSON.stringify(data.bullets || []),
        techStack: JSON.stringify(data.techStack || []),
        industries: JSON.stringify(data.industries || []),
        anonymizeCompany: data.anonymizeCompany ?? false,
        companyAlias: data.companyAlias || null,
        order: nextOrder,
        status: data.status || "PUBLISHED",
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/experience");
    revalidatePath("/resume");

    return { success: true, item: created };
  } catch (error: any) {
    console.error("Create experience error:", error);
    return { error: error.message || "Failed to create experience." };
  }
}

export async function updateExperienceAction(
  id: string,
  data: {
    company: string;
    companyUrl?: string;
    logoUrl?: string;
    title: string;
    location: string;
    startDate: string;
    endDate?: string | null;
    summary: string;
    bullets: string[];
    techStack: string[];
    industries: string[];
    anonymizeCompany?: boolean;
    companyAlias?: string | null;
    status?: string;
    visible?: boolean;
  }
) {
  await requireAdminSession();

  try {
    const updated = await prisma.experience.update({
      where: { id },
      data: {
        company: data.company,
        companyUrl: data.companyUrl || null,
        logoUrl: data.logoUrl || null,
        title: data.title,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate || null,
        summary: data.summary,
        bullets: JSON.stringify(data.bullets || []),
        techStack: JSON.stringify(data.techStack || []),
        industries: JSON.stringify(data.industries || []),
        anonymizeCompany: data.anonymizeCompany ?? false,
        companyAlias: data.companyAlias || null,
        status: data.status,
        visible: data.visible,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/experience");
    revalidatePath("/resume");

    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Update experience error:", error);
    return { error: error.message || "Failed to update experience." };
  }
}

export async function deleteExperienceAction(id: string) {
  await requireAdminSession();

  try {
    await prisma.experience.delete({ where: { id } });

    revalidatePath("/", "layout");
    revalidatePath("/admin/experience");
    revalidatePath("/resume");

    return { success: true };
  } catch (error: any) {
    console.error("Delete experience error:", error);
    return { error: error.message || "Failed to delete experience." };
  }
}

export async function duplicateExperienceAction(id: string) {
  await requireAdminSession();

  try {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) throw new Error("Experience item not found");

    const created = await prisma.experience.create({
      data: {
        company: `${existing.company} (Copy)`,
        companyUrl: existing.companyUrl,
        logoUrl: existing.logoUrl,
        title: existing.title,
        location: existing.location,
        startDate: existing.startDate,
        endDate: existing.endDate,
        summary: existing.summary,
        bullets: existing.bullets,
        techStack: existing.techStack,
        industries: existing.industries,
        anonymizeCompany: existing.anonymizeCompany,
        companyAlias: existing.companyAlias,
        order: existing.order + 1,
        status: "DRAFT",
        visible: existing.visible,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/experience");

    return { success: true, item: created };
  } catch (error: any) {
    console.error("Duplicate experience error:", error);
    return { error: error.message || "Failed to duplicate experience." };
  }
}

export async function toggleExperienceStatusAction(id: string) {
  await requireAdminSession();

  try {
    const item = await prisma.experience.findUnique({ where: { id } });
    if (!item) throw new Error("Item not found");

    const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.experience.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/experience");

    return { success: true, status: newStatus };
  } catch (error: any) {
    return { error: error.message || "Failed to toggle status." };
  }
}

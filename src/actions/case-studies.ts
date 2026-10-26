"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createCaseStudyAction(data: {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  customerName: string;
  anonymizeCustomer?: boolean;
  customerAlias?: string | null;
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics: { label: string; value: string; unit?: string; before?: string; after?: string }[];
  techStack: string[];
  coverImageUrl?: string | null;
  architectureImageUrl?: string | null;
  links?: { label: string; url: string }[];
  featured?: boolean;
  status?: string;
  visible?: boolean;
}) {
  await requireAdminSession();

  try {
    const highest = await prisma.caseStudy.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;

    const created = await prisma.caseStudy.create({
      data: {
        slug: data.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        title: data.title,
        summary: data.summary,
        industry: data.industry,
        customerName: data.customerName,
        anonymizeCustomer: data.anonymizeCustomer ?? true,
        customerAlias: data.customerAlias || null,
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
        metrics: JSON.stringify(data.metrics || []),
        techStack: JSON.stringify(data.techStack || []),
        coverImageUrl: data.coverImageUrl || null,
        architectureImageUrl: data.architectureImageUrl || null,
        links: JSON.stringify(data.links || []),
        featured: data.featured ?? false,
        order,
        status: data.status || "PUBLISHED",
        visible: data.visible ?? true,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/case-studies");
    revalidatePath(`/work/${created.slug}`);

    return { success: true, item: created };
  } catch (error: any) {
    console.error("Create case study error:", error);
    return { error: error.message || "Failed to create case study" };
  }
}

export async function updateCaseStudyAction(
  id: string,
  data: {
    slug: string;
    title: string;
    summary: string;
    industry: string;
    customerName: string;
    anonymizeCustomer?: boolean;
    customerAlias?: string | null;
    situation: string;
    task: string;
    action: string;
    result: string;
    metrics: { label: string; value: string; unit?: string; before?: string; after?: string }[];
    techStack: string[];
    coverImageUrl?: string | null;
    architectureImageUrl?: string | null;
    links?: { label: string; url: string }[];
    featured?: boolean;
    status?: string;
    visible?: boolean;
  }
) {
  await requireAdminSession();

  try {
    const updated = await prisma.caseStudy.update({
      where: { id },
      data: {
        slug: data.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        title: data.title,
        summary: data.summary,
        industry: data.industry,
        customerName: data.customerName,
        anonymizeCustomer: data.anonymizeCustomer ?? true,
        customerAlias: data.customerAlias || null,
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
        metrics: JSON.stringify(data.metrics || []),
        techStack: JSON.stringify(data.techStack || []),
        coverImageUrl: data.coverImageUrl || null,
        architectureImageUrl: data.architectureImageUrl || null,
        links: JSON.stringify(data.links || []),
        featured: data.featured ?? false,
        status: data.status,
        visible: data.visible,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/case-studies");
    revalidatePath(`/work/${updated.slug}`);

    return { success: true, item: updated };
  } catch (error: any) {
    console.error("Update case study error:", error);
    return { error: error.message || "Failed to update case study" };
  }
}

export async function deleteCaseStudyAction(id: string) {
  await requireAdminSession();

  try {
    const item = await prisma.caseStudy.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/case-studies");
    revalidatePath(`/work/${item.slug}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete case study" };
  }
}

export async function toggleCaseStudyStatusAction(id: string) {
  await requireAdminSession();
  try {
    const item = await prisma.caseStudy.findUnique({ where: { id } });
    if (!item) throw new Error("Item not found");
    const newStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await prisma.caseStudy.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/case-studies");
    return { success: true, status: newStatus };
  } catch (err: any) {
    return { error: err.message || "Failed to toggle status" };
  }
}

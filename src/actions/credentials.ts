"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// Education Actions
export async function createEducationAction(data: {
  institution: string;
  degree: string;
  field: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  highlights?: string[];
  status?: string;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.education.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;

    const created = await prisma.education.create({
      data: {
        institution: data.institution,
        degree: data.degree,
        field: data.field,
        location: data.location || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        highlights: JSON.stringify(data.highlights || []),
        order,
        status: data.status || "PUBLISHED",
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/credentials");
    revalidatePath("/resume");

    return { success: true, item: created };
  } catch (err: any) {
    return { error: err.message || "Failed to create education" };
  }
}

export async function deleteEducationAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.education.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/credentials");
    revalidatePath("/resume");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete education" };
  }
}

// Certification Actions
export async function createCertificationAction(data: {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  url?: string | null;
  status?: string;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.certification.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;

    const created = await prisma.certification.create({
      data: {
        name: data.name,
        issuer: data.issuer,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate || null,
        credentialId: data.credentialId || null,
        url: data.url || null,
        order,
        status: data.status || "PUBLISHED",
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/credentials");
    revalidatePath("/resume");

    return { success: true, item: created };
  } catch (err: any) {
    return { error: err.message || "Failed to create certification" };
  }
}

export async function deleteCertificationAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.certification.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/credentials");
    revalidatePath("/resume");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete certification" };
  }
}

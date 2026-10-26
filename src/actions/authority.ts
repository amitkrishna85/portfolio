"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// Leadership Actions
export async function createLeadershipAction(data: {
  title: string;
  description: string;
  example?: string | null;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.leadershipPrinciple.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const item = await prisma.leadershipPrinciple.create({
      data: {
        title: data.title,
        description: data.description,
        example: data.example || null,
        order,
      },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/leadership");
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message || "Failed to create leadership principle" };
  }
}

export async function deleteLeadershipAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.leadershipPrinciple.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/leadership");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete leadership principle" };
  }
}

// Talks / Patents Actions
export async function createTalkAction(data: {
  title: string;
  kind: string;
  eventOrPub: string;
  date: string;
  url?: string | null;
  description?: string | null;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.talk.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const item = await prisma.talk.create({
      data: {
        title: data.title,
        kind: data.kind,
        eventOrPub: data.eventOrPub,
        date: data.date,
        url: data.url || null,
        description: data.description || null,
        order,
      },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/talks");
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message || "Failed to create talk or patent" };
  }
}

export async function deleteTalkAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.talk.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/talks");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete talk" };
  }
}

// Recommendations Actions
export async function createRecommendationAction(data: {
  authorName: string;
  authorTitle: string;
  authorOrg: string;
  authorAvatar?: string | null;
  relationship?: string | null;
  quote: string;
  linkedinUrl?: string | null;
}) {
  await requireAdminSession();
  try {
    const highest = await prisma.recommendation.findFirst({ orderBy: { order: "desc" } });
    const order = (highest?.order ?? 0) + 1;
    const item = await prisma.recommendation.create({
      data: {
        authorName: data.authorName,
        authorTitle: data.authorTitle,
        authorOrg: data.authorOrg,
        authorAvatar: data.authorAvatar || null,
        relationship: data.relationship || null,
        quote: data.quote,
        linkedinUrl: data.linkedinUrl || null,
        order,
      },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/recommendations");
    return { success: true, item };
  } catch (err: any) {
    return { error: err.message || "Failed to create recommendation" };
  }
}

export async function deleteRecommendationAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.recommendation.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/admin/recommendations");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete recommendation" };
  }
}

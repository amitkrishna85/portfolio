"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState: any, formData: FormData) {
  await requireAdminSession();

  try {
    const fullName = formData.get("fullName") as string;
    const headline = formData.get("headline") as string;
    const location = formData.get("location") as string;
    const summaryShort = formData.get("summaryShort") as string;
    const aboutLong = formData.get("aboutLong") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const websiteUrl = formData.get("websiteUrl") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const resumeUrl = formData.get("resumeUrl") as string;
    const availabilityStatus = formData.get("availabilityStatus") as string;

    const targetRolesRaw = formData.get("targetRoles") as string;
    const industriesFocusRaw = formData.get("industriesFocus") as string;

    const targetRoles = targetRolesRaw
      ? targetRolesRaw.split("\n").map((r) => r.trim()).filter(Boolean)
      : [];
    const industriesFocus = industriesFocusRaw
      ? industriesFocusRaw.split("\n").map((i) => i.trim()).filter(Boolean)
      : [];

    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const ogImageUrl = formData.get("ogImageUrl") as string;

    await prisma.profile.upsert({
      where: { id: "singleton" },
      update: {
        fullName,
        headline,
        location,
        summaryShort,
        aboutLong,
        email,
        phone: phone || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        websiteUrl: websiteUrl || null,
        avatarUrl: avatarUrl || null,
        resumeUrl: resumeUrl || null,
        availabilityStatus: availabilityStatus || "OPEN_TO_DISCUSS",
        targetRoles: JSON.stringify(targetRoles),
        industriesFocus: JSON.stringify(industriesFocus),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        ogImageUrl: ogImageUrl || null,
      },
      create: {
        id: "singleton",
        fullName,
        headline,
        location,
        summaryShort,
        aboutLong,
        email,
        phone: phone || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        websiteUrl: websiteUrl || null,
        avatarUrl: avatarUrl || null,
        resumeUrl: resumeUrl || null,
        availabilityStatus: availabilityStatus || "OPEN_TO_DISCUSS",
        targetRoles: JSON.stringify(targetRoles),
        industriesFocus: JSON.stringify(industriesFocus),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        ogImageUrl: ogImageUrl || null,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/profile");
    revalidatePath("/resume");

    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: error.message || "Failed to update profile." };
  }
}

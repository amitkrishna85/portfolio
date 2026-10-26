"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function updateThemeSettingsAction(accentColor: string, defaultTheme: string) {
  await requireAdminSession();

  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: { accentColor, defaultTheme },
      create: { id: "singleton", accentColor, defaultTheme },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update theme settings" };
  }
}

export async function dryRunImportAction(jsonString: string) {
  await requireAdminSession();

  try {
    const data = JSON.parse(jsonString);

    const summary = {
      valid: true,
      hasProfile: !!data.profile,
      metricsCount: Array.isArray(data.impactMetrics) ? data.impactMetrics.length : 0,
      experienceCount: Array.isArray(data.experience) ? data.experience.length : 0,
      caseStudiesCount: Array.isArray(data.caseStudies) ? data.caseStudies.length : 0,
      capabilitiesCount: Array.isArray(data.solutionCapabilities) ? data.solutionCapabilities.length : 0,
      industriesCount: Array.isArray(data.industryVerticals) ? data.industryVerticals.length : 0,
      integrationsCount: Array.isArray(data.integrationItems) ? data.integrationItems.length : 0,
      diagramsCount: Array.isArray(data.architectureDiagrams) ? data.architectureDiagrams.length : 0,
      skillsCount: Array.isArray(data.skills) ? data.skills.length : 0,
      leadershipCount: Array.isArray(data.leadershipPrinciples) ? data.leadershipPrinciples.length : 0,
      educationCount: Array.isArray(data.education) ? data.education.length : 0,
      certificationsCount: Array.isArray(data.certifications) ? data.certifications.length : 0,
    };

    return { success: true, summary };
  } catch (err: any) {
    return { success: false, error: "Invalid JSON format: " + err.message };
  }
}

export async function executeImportAction(jsonString: string) {
  await requireAdminSession();

  try {
    const data = JSON.parse(jsonString);

    // 1. Automatically create a backup snapshot first!
    await prisma.siteSnapshot.create({
      data: {
        label: `Pre-Import Backup (${new Date().toLocaleTimeString()})`,
        description: "Automatic safeguard backup prior to JSON import",
        data: JSON.stringify(data),
      },
    });

    // 2. Perform restoration
    await prisma.$transaction(async (tx) => {
      if (data.profile) {
        const { id, updatedAt, ...profileData } = data.profile;
        await tx.profile.upsert({
          where: { id: "singleton" },
          update: profileData,
          create: { id: "singleton", ...profileData },
        });
      }

      if (Array.isArray(data.impactMetrics)) {
        await tx.impactMetric.deleteMany();
        for (const item of data.impactMetrics) {
          const { id, ...itemData } = item;
          await tx.impactMetric.create({ data: itemData });
        }
      }

      if (Array.isArray(data.experience)) {
        await tx.experience.deleteMany();
        for (const item of data.experience) {
          const { id, createdAt, updatedAt, ...itemData } = item;
          await tx.experience.create({ data: itemData });
        }
      }

      if (Array.isArray(data.caseStudies)) {
        await tx.caseStudy.deleteMany();
        for (const item of data.caseStudies) {
          const { id, createdAt, updatedAt, ...itemData } = item;
          await tx.caseStudy.create({ data: itemData });
        }
      }

      if (Array.isArray(data.solutionCapabilities)) {
        await tx.solutionCapability.deleteMany();
        for (const item of data.solutionCapabilities) {
          const { id, ...itemData } = item;
          await tx.solutionCapability.create({ data: itemData });
        }
      }

      if (Array.isArray(data.industryVerticals)) {
        await tx.industryVertical.deleteMany();
        for (const item of data.industryVerticals) {
          const { id, ...itemData } = item;
          await tx.industryVertical.create({ data: itemData });
        }
      }

      if (Array.isArray(data.integrationItems)) {
        await tx.integrationItem.deleteMany();
        for (const item of data.integrationItems) {
          const { id, ...itemData } = item;
          await tx.integrationItem.create({ data: itemData });
        }
      }

      if (Array.isArray(data.architectureDiagrams)) {
        await tx.architectureDiagram.deleteMany();
        for (const item of data.architectureDiagrams) {
          const { id, updatedAt, ...itemData } = item;
          await tx.architectureDiagram.create({ data: itemData });
        }
      }

      if (Array.isArray(data.leadershipPrinciples)) {
        await tx.leadershipPrinciple.deleteMany();
        for (const item of data.leadershipPrinciples) {
          const { id, ...itemData } = item;
          await tx.leadershipPrinciple.create({ data: itemData });
        }
      }

      if (Array.isArray(data.education)) {
        await tx.education.deleteMany();
        for (const item of data.education) {
          const { id, ...itemData } = item;
          await tx.education.create({ data: itemData });
        }
      }

      if (Array.isArray(data.certifications)) {
        await tx.certification.deleteMany();
        for (const item of data.certification) {
          const { id, ...itemData } = item;
          await tx.certification.create({ data: itemData });
        }
      }
    });

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/resume");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to execute import." };
  }
}

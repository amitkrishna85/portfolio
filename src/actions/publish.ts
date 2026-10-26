"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function publishSiteAction(label?: string) {
  await requireAdminSession();

  try {
    // 1. Fetch current full state of all data models
    const [
      profile,
      impactMetrics,
      experience,
      caseStudies,
      solutionCapabilities,
      industryVerticals,
      integrationItems,
      architectureDiagrams,
      skillCategories,
      skills,
      leadershipPrinciples,
      recommendations,
      talks,
      education,
      certifications,
      siteSettings,
    ] = await Promise.all([
      prisma.profile.findUnique({ where: { id: "singleton" } }),
      prisma.impactMetric.findMany(),
      prisma.experience.findMany(),
      prisma.caseStudy.findMany(),
      prisma.solutionCapability.findMany(),
      prisma.industryVertical.findMany(),
      prisma.integrationItem.findMany(),
      prisma.architectureDiagram.findMany(),
      prisma.skillCategory.findMany(),
      prisma.skill.findMany(),
      prisma.leadershipPrinciple.findMany(),
      prisma.recommendation.findMany(),
      prisma.talk.findMany(),
      prisma.education.findMany(),
      prisma.certification.findMany(),
      prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    ]);

    const snapshotPayload = {
      timestamp: new Date().toISOString(),
      profile,
      impactMetrics,
      experience,
      caseStudies,
      solutionCapabilities,
      industryVerticals,
      integrationItems,
      architectureDiagrams,
      skillCategories,
      skills,
      leadershipPrinciples,
      recommendations,
      talks,
      education,
      certifications,
      siteSettings,
    };

    // 2. Create SiteSnapshot
    const createdSnapshot = await prisma.siteSnapshot.create({
      data: {
        label: label || `Snapshot - ${new Date().toLocaleString()}`,
        description: "Automatic snapshot created during site publish",
        data: JSON.stringify(snapshotPayload),
      },
    });

    // 3. Trigger Next.js on-demand revalidation
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/resume");

    return {
      success: true,
      snapshotId: createdSnapshot.id,
      publishedAt: new Date().toLocaleTimeString(),
    };
  } catch (error: any) {
    console.error("Publish site failed:", error);
    return {
      success: false,
      error: error.message || "Failed to publish site and create snapshot.",
    };
  }
}

export async function restoreSnapshotAction(snapshotId: string) {
  await requireAdminSession();

  try {
    const snapshot = await prisma.siteSnapshot.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) {
      throw new Error("Snapshot not found.");
    }

    const data = JSON.parse(snapshot.data);

    // Transactional restore
    await prisma.$transaction(async (tx) => {
      if (data.profile) {
        const { id, updatedAt, ...profileData } = data.profile;
        await tx.profile.upsert({
          where: { id: "singleton" },
          update: profileData,
          create: { id: "singleton", ...profileData },
        });
      }

      if (data.siteSettings) {
        const { id, updatedAt, ...settingsData } = data.siteSettings;
        await tx.siteSettings.upsert({
          where: { id: "singleton" },
          update: settingsData,
          create: { id: "singleton", ...settingsData },
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

      if (Array.isArray(data.skillCategories)) {
        await tx.skill.deleteMany();
        await tx.skillCategory.deleteMany();

        for (const cat of data.skillCategories) {
          const createdCat = await tx.skillCategory.create({
            data: { name: cat.name, order: cat.order },
          });

          // Match skills belonging to this category
          const catSkills = (data.skills || []).filter((s: any) => s.categoryId === cat.id);
          for (const s of catSkills) {
            await tx.skill.create({
              data: {
                name: s.name,
                level: s.level,
                order: s.order,
                categoryId: createdCat.id,
              },
            });
          }
        }
      }

      if (Array.isArray(data.leadershipPrinciples)) {
        await tx.leadershipPrinciple.deleteMany();
        for (const item of data.leadershipPrinciples) {
          const { id, ...itemData } = item;
          await tx.leadershipPrinciple.create({ data: itemData });
        }
      }

      if (Array.isArray(data.recommendations)) {
        await tx.recommendation.deleteMany();
        for (const item of data.recommendations) {
          const { id, ...itemData } = item;
          await tx.recommendation.create({ data: itemData });
        }
      }

      if (Array.isArray(data.talks)) {
        await tx.talk.deleteMany();
        for (const item of data.talks) {
          const { id, ...itemData } = item;
          await tx.talk.create({ data: itemData });
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
        for (const item of data.certifications) {
          const { id, ...itemData } = item;
          await tx.certification.create({ data: itemData });
        }
      }
    });

    // Revalidate paths
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/resume");

    return { success: true };
  } catch (error: any) {
    console.error("Restore snapshot failed:", error);
    return { success: false, error: error.message || "Failed to restore snapshot." };
  }
}

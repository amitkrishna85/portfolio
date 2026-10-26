import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Reading content from seed/content.json...");
  const contentPath = path.join(process.cwd(), "seed", "content.json");
  const rawData = await fs.readFile(contentPath, "utf-8");
  const data = JSON.parse(rawData);

  console.log("Seeding Profile...");
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {
      fullName: data.profile.fullName,
      headline: data.profile.headline,
      location: data.profile.location,
      summaryShort: data.profile.summaryShort,
      aboutLong: data.profile.aboutLong,
      email: data.profile.email,
      phone: data.profile.phone,
      linkedinUrl: data.profile.linkedinUrl,
      githubUrl: data.profile.githubUrl,
      websiteUrl: data.profile.websiteUrl,
      avatarUrl: data.profile.avatarUrl || null,
      resumeUrl: data.profile.resumeUrl || null,
      availabilityStatus: data.profile.availabilityStatus || "OPEN_TO_DISCUSS",
      targetRoles: JSON.stringify(data.profile.targetRoles || []),
      industriesFocus: JSON.stringify(data.profile.industriesFocus || []),
      seoTitle: data.profile.seoTitle || null,
      seoDescription: data.profile.seoDescription || null,
      ogImageUrl: data.profile.ogImageUrl || null,
    },
    create: {
      id: "singleton",
      fullName: data.profile.fullName,
      headline: data.profile.headline,
      location: data.profile.location,
      summaryShort: data.profile.summaryShort,
      aboutLong: data.profile.aboutLong,
      email: data.profile.email,
      phone: data.profile.phone,
      linkedinUrl: data.profile.linkedinUrl,
      githubUrl: data.profile.githubUrl,
      websiteUrl: data.profile.websiteUrl,
      avatarUrl: data.profile.avatarUrl || null,
      resumeUrl: data.profile.resumeUrl || null,
      availabilityStatus: data.profile.availabilityStatus || "OPEN_TO_DISCUSS",
      targetRoles: JSON.stringify(data.profile.targetRoles || []),
      industriesFocus: JSON.stringify(data.profile.industriesFocus || []),
      seoTitle: data.profile.seoTitle || null,
      seoDescription: data.profile.seoDescription || null,
      ogImageUrl: data.profile.ogImageUrl || null,
    },
  });

  console.log("Seeding Impact Metrics...");
  await prisma.impactMetric.deleteMany();
  for (const item of data.impactMetrics || []) {
    await prisma.impactMetric.create({
      data: {
        label: item.label,
        value: item.value,
        suffix: item.suffix || null,
        description: item.description || null,
        order: item.order || 0,
        visible: true,
      },
    });
  }

  console.log("Seeding Experience...");
  await prisma.experience.deleteMany();
  for (const item of data.experience || []) {
    await prisma.experience.create({
      data: {
        company: item.company,
        companyUrl: item.companyUrl || null,
        logoUrl: item.logoUrl || null,
        title: item.title,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate || null,
        summary: item.summary,
        bullets: JSON.stringify(item.bullets || []),
        techStack: JSON.stringify(item.techStack || []),
        industries: JSON.stringify(item.industries || []),
        anonymizeCompany: item.anonymizeCompany ?? false,
        companyAlias: item.companyAlias || null,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Case Studies...");
  await prisma.caseStudy.deleteMany();
  for (const item of data.caseStudies || []) {
    await prisma.caseStudy.create({
      data: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        industry: item.industry,
        customerName: item.customerName,
        anonymizeCustomer: item.anonymizeCustomer ?? true,
        customerAlias: item.customerAlias || null,
        situation: item.situation,
        task: item.task,
        action: item.action,
        result: item.result,
        metrics: JSON.stringify(item.metrics || []),
        techStack: JSON.stringify(item.techStack || []),
        coverImageUrl: item.coverImageUrl || null,
        architectureImageUrl: item.architectureImageUrl || null,
        links: JSON.stringify(item.links || []),
        featured: item.featured ?? false,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Solution Capabilities...");
  await prisma.solutionCapability.deleteMany();
  for (const item of data.solutionCapabilities || []) {
    await prisma.solutionCapability.create({
      data: {
        title: item.title,
        description: item.description,
        icon: item.icon || "Cpu",
        category: item.category,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Industries...");
  await prisma.industryVertical.deleteMany();
  for (const item of data.industries || []) {
    await prisma.industryVertical.create({
      data: {
        name: item.name,
        description: item.description,
        iconKey: item.iconKey || "Factory",
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Integrations...");
  await prisma.integrationItem.deleteMany();
  for (const item of data.integrations || []) {
    await prisma.integrationItem.create({
      data: {
        name: item.name,
        category: item.category,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Architecture Diagrams...");
  await prisma.architectureDiagram.deleteMany();
  for (const item of data.architectureDiagrams || []) {
    await prisma.architectureDiagram.create({
      data: {
        title: item.title,
        description: item.description,
        kind: item.kind || "REFERENCE",
        svgOrImageUrl: item.svgOrImageUrl || null,
        layers: JSON.stringify(item.layers || []),
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Skills...");
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  let catOrder = 1;
  for (const cat of data.skills || []) {
    const createdCat = await prisma.skillCategory.create({
      data: {
        name: cat.category,
        order: catOrder++,
      },
    });
    let skillOrder = 1;
    for (const item of cat.items || []) {
      await prisma.skill.create({
        data: {
          name: item.name,
          level: item.level || 5,
          order: skillOrder++,
          categoryId: createdCat.id,
        },
      });
    }
  }

  console.log("Seeding Leadership Principles...");
  await prisma.leadershipPrinciple.deleteMany();
  for (const item of data.leadershipPrinciples || []) {
    await prisma.leadershipPrinciple.create({
      data: {
        title: item.title,
        description: item.description,
        example: item.example || null,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Recommendations...");
  await prisma.recommendation.deleteMany();
  for (const item of data.recommendations || []) {
    await prisma.recommendation.create({
      data: {
        authorName: item.authorName,
        authorTitle: item.authorTitle,
        authorOrg: item.authorOrg,
        authorAvatar: item.authorAvatar || null,
        relationship: item.relationship || null,
        quote: item.quote,
        linkedinUrl: item.linkedinUrl || null,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Talks, Patents & Awards...");
  await prisma.talk.deleteMany();
  for (const item of data.talks || []) {
    await prisma.talk.create({
      data: {
        title: item.title,
        kind: item.kind || "TALK",
        eventOrPub: item.eventOrPub,
        date: item.date,
        url: item.url || null,
        description: item.description || null,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
        visible: true,
      },
    });
  }

  console.log("Seeding Education...");
  await prisma.education.deleteMany();
  for (const item of data.education || []) {
    await prisma.education.create({
      data: {
        institution: item.institution,
        degree: item.degree,
        field: item.field,
        location: item.location || null,
        startDate: item.startDate || null,
        endDate: item.endDate || null,
        highlights: JSON.stringify(item.highlights || []),
        order: item.order || 0,
        status: item.status || "PUBLISHED",
      },
    });
  }

  console.log("Seeding Certifications...");
  await prisma.certification.deleteMany();
  for (const item of data.certifications || []) {
    await prisma.certification.create({
      data: {
        name: item.name,
        issuer: item.issuer,
        issueDate: item.issueDate,
        expiryDate: item.expiryDate || null,
        credentialId: item.credentialId || null,
        url: item.url || null,
        order: item.order || 0,
        status: item.status || "PUBLISHED",
      },
    });
  }

  console.log("Seeding SiteSettings...");
  const defaultSectionVisibility = {
    hero: true,
    impact: true,
    about: true,
    solutions: true,
    architecture: true,
    experience: true,
    caseStudies: true,
    skills: true,
    leadership: true,
    credentials: true,
    talks: true,
    recommendations: true,
    contact: true,
  };

  const defaultSectionOrder = [
    "hero",
    "impact",
    "about",
    "solutions",
    "architecture",
    "experience",
    "caseStudies",
    "skills",
    "leadership",
    "credentials",
    "talks",
    "recommendations",
    "contact",
  ];

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      sectionVisibility: JSON.stringify(defaultSectionVisibility),
      sectionOrder: JSON.stringify(defaultSectionOrder),
      accentColor: "cyan",
      defaultTheme: "dark",
    },
    create: {
      id: "singleton",
      sectionVisibility: JSON.stringify(defaultSectionVisibility),
      sectionOrder: JSON.stringify(defaultSectionOrder),
      accentColor: "cyan",
      defaultTheme: "dark",
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

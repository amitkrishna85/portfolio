import * as React from "react";
import Link from "next/link";
import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { ImpactSection } from "./impact";
import { AboutSection } from "./about";
import { SolutionsSection } from "./solutions";
import { ArchitectureSection } from "./architecture-section";
import { ExperienceSection } from "./experience";
import { CaseStudiesSection } from "./case-studies-section";
import { SkillsSection } from "./skills-section";
import { LeadershipSection } from "./leadership-section";
import { CredentialsSection } from "./credentials-section";
import { TalksSection } from "./talks-section";
import { RecommendationsSection } from "./recommendations-section";
import { ContactSection } from "./contact-section";
import { Footer } from "./footer";
import { ViewTracker } from "@/components/shared/view-tracker";
import { Eye, ArrowLeft, Shield } from "lucide-react";

interface PublicPortfolioProps {
  data: {
    profile: any;
    impactMetrics: any[];
    experience: any[];
    caseStudies: any[];
    solutionCapabilities: any[];
    industryVerticals: any[];
    integrationItems: any[];
    architectureDiagram: any;
    skillCategories: any[];
    leadershipPrinciples: any[];
    recommendations: any[];
    talks: any[];
    education: any[];
    certifications: any[];
    sectionOrder: string[];
    sectionVisibility: Record<string, boolean>;
  };
  isPreview?: boolean;
}

export function PublicPortfolio({ data, isPreview = false }: PublicPortfolioProps) {
  const {
    profile,
    impactMetrics,
    experience,
    caseStudies,
    solutionCapabilities,
    industryVerticals,
    integrationItems,
    architectureDiagram,
    skillCategories,
    leadershipPrinciples,
    recommendations,
    talks,
    education,
    certifications,
    sectionOrder,
    sectionVisibility,
  } = data;

  const defaultOrder = [
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

  const activeOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  const renderSection = (key: string) => {
    if (sectionVisibility && sectionVisibility[key] === false) {
      return null;
    }

    switch (key) {
      case "hero":
        return (
          <Hero
            key="hero"
            fullName={profile?.fullName || "Amit Krishna"}
            headline={
              profile?.headline || "Director of Engineering - Industrial Digital Twin Platforms"
            }
            summaryShort={profile?.summaryShort || ""}
            availabilityStatus={profile?.availabilityStatus || "OPEN_TO_DISCUSS"}
            resumeUrl={profile?.resumeUrl}
            linkedinUrl={profile?.linkedinUrl}
          />
        );
      case "impact":
        return <ImpactSection key="impact" metrics={impactMetrics} />;
      case "about":
        return (
          <AboutSection
            key="about"
            fullName={profile?.fullName || "Amit Krishna"}
            headline={profile?.headline || ""}
            location={profile?.location || ""}
            aboutLong={profile?.aboutLong || ""}
            email={profile?.email || ""}
            phone={profile?.phone}
            avatarUrl={profile?.avatarUrl}
            targetRoles={profile?.targetRoles || []}
            industriesFocus={profile?.industriesFocus || []}
          />
        );
      case "solutions":
        return (
          <SolutionsSection
            key="solutions"
            capabilities={solutionCapabilities}
            industries={industryVerticals}
            integrations={integrationItems}
          />
        );
      case "architecture":
        return <ArchitectureSection key="architecture" diagram={architectureDiagram} />;
      case "experience":
        return <ExperienceSection key="experience" experiences={experience} />;
      case "caseStudies":
        return <CaseStudiesSection key="caseStudies" caseStudies={caseStudies} />;
      case "skills":
        return <SkillsSection key="skills" categories={skillCategories} />;
      case "leadership":
        return <LeadershipSection key="leadership" principles={leadershipPrinciples} />;
      case "credentials":
        return (
          <CredentialsSection
            key="credentials"
            education={education}
            certifications={certifications}
          />
        );
      case "talks":
        return <TalksSection key="talks" talks={talks} />;
      case "recommendations":
        return <RecommendationsSection key="recommendations" recommendations={recommendations} />;
      case "contact":
        return (
          <ContactSection
            key="contact"
            email={profile?.email || ""}
            phone={profile?.phone}
            linkedinUrl={profile?.linkedinUrl}
            githubUrl={profile?.githubUrl}
            websiteUrl={profile?.websiteUrl}
          />
        );
      default:
        return null;
    }
  };

  // JSON-LD Person Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.fullName || "Amit Krishna",
    jobTitle: profile?.headline || "Director of Engineering",
    description: profile?.summaryShort,
    url: profile?.websiteUrl || process.env.NEXT_PUBLIC_APP_URL || "https://amitkrishna.dev",
    sameAs: [profile?.linkedinUrl, profile?.githubUrl].filter(Boolean),
    knowsAbout: [
      "Industrial Digital Twin Platforms",
      "OT/IT Convergence",
      "OPC UA",
      "MQTT Sparkplug B",
      "Asset Performance Management",
      "Distributed Systems",
      "Kubernetes",
      "IEC 62443",
    ],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative selection:bg-primary/20 selection:text-primary">
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Admin Preview Mode Floating Banner */}
      {isPreview && (
        <div className="sticky top-0 z-50 w-full bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>ADMIN PREVIEW MODE — Displaying both Draft and Published items</span>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 text-white text-[11px] font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to CMS
          </Link>
        </div>
      )}

      <Navbar fullName={profile?.fullName || "Amit Krishna"} resumeUrl={profile?.resumeUrl} />

      <main className="flex-1 space-y-4">
        {activeOrder.map((sectionKey) => renderSection(sectionKey))}
      </main>

      <Footer fullName={profile?.fullName || "Amit Krishna"} />
      <ViewTracker />
    </div>
  );
}

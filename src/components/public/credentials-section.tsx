import * as React from "react";
import { GraduationCap, Award, ExternalLink, ShieldCheck } from "lucide-react";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  highlights: string[];
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  url: string | null;
}

export function CredentialsSection({
  education,
  certifications,
}: {
  education: EducationItem[];
  certifications: CertificationItem[];
}) {
  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <section id="credentials" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-border/60 space-y-12">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Academic & Industry Credentials</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Education & Professional Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Education */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-bold text-sm">
            <GraduationCap className="w-4 h-4 text-primary" />
            <h3>Formal Education & Engineering Degrees</h3>
          </div>

          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="p-5 rounded-xl border border-border bg-card/60 shadow-xs space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-foreground">{edu.degree}</h4>
                <p className="text-xs font-semibold text-primary">{edu.field}</p>
                <div className="text-xs text-muted-foreground">
                  <span>{edu.institution}</span>
                  {edu.location && <span> • {edu.location}</span>}
                  {(edu.startDate || edu.endDate) && (
                    <span className="font-mono"> • {edu.startDate} - {edu.endDate}</span>
                  )}
                </div>

                {edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-xs text-muted-foreground/90 space-y-1 pt-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border text-foreground font-bold text-sm">
            <Award className="w-4 h-4 text-primary" />
            <h3>Industry Accreditations & Cybersecurity</h3>
          </div>

          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-5 rounded-xl border border-border bg-card/60 shadow-xs space-y-2">
                <h4 className="font-extrabold text-sm sm:text-base text-foreground">{cert.name}</h4>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{cert.issuer}</span>
                  <span className="font-mono"> • Issued {cert.issueDate}</span>
                  {cert.expiryDate && <span className="font-mono"> • Valid thru {cert.expiryDate}</span>}
                </div>
                {cert.credentialId && (
                  <div className="text-[11px] font-mono text-muted-foreground">
                    Credential ID: {cert.credentialId}
                  </div>
                )}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>Verify Credential Online</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

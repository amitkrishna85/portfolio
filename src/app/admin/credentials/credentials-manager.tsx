"use client";

import * as React from "react";
import {
  createEducationAction,
  deleteEducationAction,
  createCertificationAction,
  deleteCertificationAction,
} from "@/actions/credentials";
import { GraduationCap, Award, Plus, Trash2, X, ExternalLink } from "lucide-react";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  highlights: string[];
  status: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  url: string | null;
  status: string;
}

export function CredentialsManager({
  initialEducation,
  initialCertifications,
}: {
  initialEducation: EducationItem[];
  initialCertifications: CertificationItem[];
}) {
  const [education, setEducation] = React.useState<EducationItem[]>(initialEducation);
  const [certifications, setCertifications] = React.useState<CertificationItem[]>(initialCertifications);

  // Modal states
  const [eduModal, setEduModal] = React.useState(false);
  const [certModal, setCertModal] = React.useState(false);

  // Edu form state
  const [eduInst, setEduInst] = React.useState("");
  const [eduDegree, setEduDegree] = React.useState("");
  const [eduField, setEduField] = React.useState("");
  const [eduLocation, setEduLocation] = React.useState("");
  const [eduStart, setEduStart] = React.useState("");
  const [eduEnd, setEduEnd] = React.useState("");
  const [eduHighlights, setEduHighlights] = React.useState("");

  // Cert form state
  const [certName, setCertName] = React.useState("");
  const [certIssuer, setCertIssuer] = React.useState("");
  const [certIssueDate, setCertIssueDate] = React.useState("");
  const [certExpiryDate, setCertExpiryDate] = React.useState("");
  const [certCredId, setCertCredId] = React.useState("");
  const [certUrl, setCertUrl] = React.useState("");

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createEducationAction({
      institution: eduInst,
      degree: eduDegree,
      field: eduField,
      location: eduLocation,
      startDate: eduStart,
      endDate: eduEnd,
      highlights: eduHighlights.split("\n").filter((h) => h.trim().length > 0),
    });
    if (res.item) {
      setEducation([
        ...education,
        {
          ...res.item,
          highlights: JSON.parse(res.item.highlights || "[]"),
        },
      ]);
      setEduModal(false);
    }
  };

  const handleDeleteEdu = async (id: string, name: string) => {
    if (!confirm(`Delete education at "${name}"?`)) return;
    const res = await deleteEducationAction(id);
    if (res.success) setEducation(education.filter((e) => e.id !== id));
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createCertificationAction({
      name: certName,
      issuer: certIssuer,
      issueDate: certIssueDate,
      expiryDate: certExpiryDate,
      credentialId: certCredId,
      url: certUrl,
    });
    if (res.item) {
      setCertifications([...certifications, res.item]);
      setCertModal(false);
    }
  };

  const handleDeleteCert = async (id: string, name: string) => {
    if (!confirm(`Delete certification "${name}"?`)) return;
    const res = await deleteCertificationAction(id);
    if (res.success) setCertifications(certifications.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Formal Education & Degrees</h2>
          </div>
          <button
            onClick={() => setEduModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Degree</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative group">
              <button
                onClick={() => handleDeleteEdu(edu.id, edu.institution)}
                className="absolute top-3 right-3 p-1 rounded text-muted-foreground hover:text-destructive"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <h3 className="font-bold text-sm text-foreground pr-8">{edu.degree}</h3>
              <p className="text-xs text-primary font-medium">{edu.field}</p>
              <div className="text-xs text-muted-foreground">
                <span>{edu.institution}</span>
                {edu.location && <span> • {edu.location}</span>}
                {(edu.startDate || edu.endDate) && (
                  <span> • {edu.startDate || ""} - {edu.endDate || ""}</span>
                )}
              </div>
              {edu.highlights.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-[11px] text-muted-foreground space-y-0.5 pt-1">
                  {edu.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Professional Certifications & Licenses</h2>
          </div>
          <button
            onClick={() => setCertModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-2 relative group">
              <button
                onClick={() => handleDeleteCert(cert.id, cert.name)}
                className="absolute top-3 right-3 p-1 rounded text-muted-foreground hover:text-destructive"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <h3 className="font-bold text-sm text-foreground pr-8">{cert.name}</h3>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{cert.issuer}</span>
                <span> • Issued {cert.issueDate}</span>
                {cert.expiryDate && <span> • Exp: {cert.expiryDate}</span>}
              </div>
              {cert.credentialId && (
                <p className="text-[11px] font-mono text-muted-foreground">ID: {cert.credentialId}</p>
              )}
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edu Modal */}
      {eduModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Education Degree</h3>
              <button onClick={() => setEduModal(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSaveEdu} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Institution *</label>
                <input required type="text" value={eduInst} onChange={(e) => setEduInst(e.target.value)} placeholder="University of Technology" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Degree *</label>
                  <input required type="text" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Master of Science" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Field of Study *</label>
                  <input required type="text" value={eduField} onChange={(e) => setEduField(e.target.value)} placeholder="Computer Science / Distributed Systems" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Start Year</label>
                  <input type="text" value={eduStart} onChange={(e) => setEduStart(e.target.value)} placeholder="2008" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">End Year</label>
                  <input type="text" value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} placeholder="2012" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Highlights (one per line)</label>
                <textarea rows={2} value={eduHighlights} onChange={(e) => setEduHighlights(e.target.value)} placeholder="Specialization in Real-Time Systems..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEduModal(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Degree</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cert Modal */}
      {certModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base text-foreground">Add Certification</h3>
              <button onClick={() => setCertModal(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSaveCert} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Certification Name *</label>
                <input required type="text" value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="IEC 62443 Industrial Cybersecurity / CISSP" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Issuing Authority *</label>
                <input required type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="ISA / AWS / (ISC)²" className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Issue Date (YYYY-MM) *</label>
                  <input required type="text" value={certIssueDate} onChange={(e) => setCertIssueDate(e.target.value)} placeholder="2023-01" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Expiry Date</label>
                  <input type="text" value={certExpiryDate} onChange={(e) => setCertExpiryDate(e.target.value)} placeholder="2026-01" className="w-full p-2 text-sm rounded border border-border bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Verification URL</label>
                <input type="url" value={certUrl} onChange={(e) => setCertUrl(e.target.value)} placeholder="https://..." className="w-full p-2 text-sm rounded border border-border bg-background" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCertModal(false)} className="px-3 py-1.5 text-xs rounded border border-border">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground font-semibold">Save Certification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

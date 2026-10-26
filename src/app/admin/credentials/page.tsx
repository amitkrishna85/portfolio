import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { CredentialsManager } from "./credentials-manager";

export default async function AdminCredentialsPage() {
  const [education, certifications] = await Promise.all([
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
  ]);

  const parsedEdu = education.map((e) => ({
    ...e,
    highlights: parseJson<string[]>(e.highlights, []),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Education & Certifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Maintain your formal academic foundations, cybersecurity licenses, and cloud architecture
          credentials.
        </p>
      </div>

      <CredentialsManager
        initialEducation={parsedEdu}
        initialCertifications={certifications}
      />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { ProfileForm } from "./profile-form";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findUnique({
    where: { id: "singleton" },
  });

  const parsedProfile = profile
    ? {
        ...profile,
        targetRoles: parseJson<string[]>(profile.targetRoles, []),
        industriesFocus: parseJson<string[]>(profile.industriesFocus, []),
      }
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile & Executive Bio
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your executive positioning, narrative, target roles, contact channels, and SEO
          metadata.
        </p>
      </div>

      <ProfileForm initialData={parsedProfile} />
    </div>
  );
}

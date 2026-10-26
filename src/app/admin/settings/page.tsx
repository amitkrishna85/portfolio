import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Settings & Data Governance
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure industrial color accents, dark mode behaviors, and perform full JSON database
          exports and dry-run restorations.
        </p>
      </div>

      <SettingsClient
        currentAccent={settings?.accentColor || "cyan"}
        currentTheme={settings?.defaultTheme || "dark"}
      />
    </div>
  );
}

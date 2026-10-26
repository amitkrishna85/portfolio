"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Activity,
  Briefcase,
  FolderGit2,
  Cpu,
  Network,
  Layers,
  Compass,
  GraduationCap,
  Award,
  MessageSquareQuote,
  SlidersHorizontal,
  Inbox,
  History,
  Settings,
  ShieldAlert,
} from "lucide-react";

const navSections = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/profile", label: "Profile & SEO", icon: User },
      { href: "/admin/metrics", label: "Impact Metrics", icon: Activity },
    ],
  },
  {
    title: "Career & Work",
    items: [
      { href: "/admin/experience", label: "Experience & Roles", icon: Briefcase },
      { href: "/admin/case-studies", label: "STAR Case Studies", icon: FolderGit2 },
      { href: "/admin/solutions", label: "Solutions & Verticals", icon: Cpu },
      { href: "/admin/architecture", label: "Twin Architecture", icon: Network },
      { href: "/admin/skills", label: "Skills Taxonomy", icon: Layers },
    ],
  },
  {
    title: "Authority & Signals",
    items: [
      { href: "/admin/leadership", label: "Leadership Philosophy", icon: Compass },
      { href: "/admin/credentials", label: "Education & Certs", icon: GraduationCap },
      { href: "/admin/talks", label: "Talks & Patents", icon: Award },
      { href: "/admin/recommendations", label: "Recommendations", icon: MessageSquareQuote },
    ],
  },
  {
    title: "Site Administration",
    items: [
      { href: "/admin/sections", label: "Section Manager", icon: SlidersHorizontal },
      { href: "/admin/messages", label: "Messages Inbox", icon: Inbox },
      { href: "/admin/snapshots", label: "Snapshots & Rollback", icon: History },
      { href: "/admin/settings", label: "Settings & Export", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-md flex flex-col flex-shrink-0 min-h-[calc(100vh-53px)]">
      <div className="p-4 border-b border-border/70 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
          OT
        </div>
        <div>
          <div className="text-xs font-bold tracking-tight text-foreground">
            Director Portfolio
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Industrial Twin CMS
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider px-2.5 mb-1.5">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border/70 bg-card/30">
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/40 text-[11px] text-muted-foreground">
          <ShieldAlert className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="truncate">IEC 62443 Guard Active</span>
        </div>
      </div>
    </aside>
  );
}

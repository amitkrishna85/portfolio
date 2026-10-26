"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`p-2 rounded-lg border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground ${className}`}
        disabled
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2 rounded-lg border border-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
    </button>
  );
}

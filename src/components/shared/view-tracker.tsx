"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function ViewTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    // Only track public routes (ignore /admin)
    if (pathname && !pathname.startsWith("/admin")) {
      try {
        fetch("/api/analytics/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== "undefined" ? document.referrer : "",
          }),
        }).catch(() => {});
      } catch {}
    }
  }, [pathname]);

  return null;
}

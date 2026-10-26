import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr.toLowerCase() === "present" || dateStr === "null") {
    return "Present";
  }

  // Handle YYYY-MM
  const parts = dateStr.split("-");
  if (parts.length === 2) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const date = new Date(year, month);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  // Handle standard YYYY
  if (parts.length === 1 && parts[0].length === 4) {
    return parts[0];
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function calculateTenure(
  startDateStr: string,
  endDateStr: string | null | undefined
): string {
  const parseStart = (s: string): Date => {
    const [y, m] = s.split("-").map(Number);
    return new Date(y, (m || 1) - 1, 1);
  };

  const parseEnd = (e: string | null | undefined): Date => {
    if (!e || e.toLowerCase() === "present") return new Date();
    const [y, m] = e.split("-").map(Number);
    return new Date(y, (m || 1) - 1, 1);
  };

  try {
    const start = parseStart(startDateStr);
    const end = parseEnd(endDateStr);

    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 1) months = 1;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const yearPart = years > 0 ? `${years} yr${years > 1 ? "s" : ""}` : "";
    const monthPart =
      remainingMonths > 0 ? `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}` : "";

    return [yearPart, monthPart].filter(Boolean).join(" ") || "1 mo";
  } catch {
    return "";
  }
}

export function getCustomerDisplayName(
  item: {
    customerName?: string | null;
    anonymizeCustomer?: boolean | null;
    customerAlias?: string | null;
  }
): string {
  if (item.anonymizeCustomer) {
    return item.customerAlias || "Confidential Industrial Client";
  }
  return item.customerName || "Confidential Client";
}

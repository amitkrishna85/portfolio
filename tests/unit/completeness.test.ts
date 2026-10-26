import { describe, it, expect } from "vitest";
import { computeScore, scanPlaceholders } from "@/lib/completeness";

describe("Completeness & Placeholder Audit", () => {
  describe("computeScore", () => {
    it("returns 0 if total is 0", () => {
      expect(computeScore(0, 0)).toBe(0);
    });

    it("calculates accurate percentage score", () => {
      expect(computeScore(7, 7)).toBe(100);
      expect(computeScore(3, 6)).toBe(50);
      expect(computeScore(5, 7)).toBe(71); // rounded
    });
  });

  describe("scanPlaceholders", () => {
    it("detects standard [ADD: ...] placeholders", () => {
      const text = "Architected digital twin reducing downtime by [ADD: percentage].";
      const detected = scanPlaceholders(text);
      expect(detected).toEqual(["[ADD: percentage]"]);
    });

    it("detects [PASTE ...] placeholders", () => {
      const text = "Executive summary: [PASTE resume summary here]";
      const detected = scanPlaceholders(text);
      expect(detected).toEqual(["[PASTE resume summary here]"]);
    });

    it("detects multiple placeholders across complex text", () => {
      const text =
        "Led team of [ADD: headcount] engineers across [ADD: number of sites] plants. Contact at [ADD: phone].";
      const detected = scanPlaceholders(text);
      expect(detected).toHaveLength(3);
      expect(detected).toContain("[ADD: headcount]");
      expect(detected).toContain("[ADD: number of sites]");
      expect(detected).toContain("[ADD: phone]");
    });

    it("returns empty array when text has zero unresolved markers", () => {
      const text =
        "Architected an enterprise digital twin platform synchronizing 150k+ telemetry points with sub-second latency across 14 manufacturing facilities.";
      expect(scanPlaceholders(text)).toEqual([]);
    });

    it("handles null and undefined gracefully", () => {
      expect(scanPlaceholders(null)).toEqual([]);
      expect(scanPlaceholders(undefined)).toEqual([]);
    });
  });
});

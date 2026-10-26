import { describe, it, expect } from "vitest";
import {
  calculateTenure,
  formatDate,
  parseJson,
  getCustomerDisplayName,
  cn,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn (tailwind merge)", () => {
    it("merges conditional class names correctly", () => {
      expect(cn("px-4 py-2", true && "bg-cyan-500", false && "hidden")).toBe(
        "px-4 py-2 bg-cyan-500"
      );
      expect(cn("p-4", "p-8")).toBe("p-8");
    });
  });

  describe("parseJson", () => {
    it("correctly parses valid JSON string", () => {
      const input = JSON.stringify(["OPC UA", "MQTT", "SCADA"]);
      const result = parseJson<string[]>(input, []);
      expect(result).toEqual(["OPC UA", "MQTT", "SCADA"]);
    });

    it("returns fallback for invalid JSON without throwing", () => {
      const corrupt = "{ invalid json string ";
      const result = parseJson(corrupt, { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it("returns fallback for null or undefined input", () => {
      expect(parseJson(null, ["default"])).toEqual(["default"]);
      expect(parseJson(undefined, ["default"])).toEqual(["default"]);
    });
  });

  describe("formatDate", () => {
    it("formats YYYY-MM correctly", () => {
      expect(formatDate("2023-01")).toMatch(/Jan 2023/);
      expect(formatDate("2021-06")).toMatch(/Jun 2021/);
    });

    it("handles Present and null gracefully", () => {
      expect(formatDate(null)).toBe("Present");
      expect(formatDate("present")).toBe("Present");
      expect(formatDate("null")).toBe("Present");
    });

    it("handles single 4-digit year", () => {
      expect(formatDate("2024")).toBe("2024");
    });
  });

  describe("calculateTenure", () => {
    it("computes exact years and months for past dates", () => {
      const tenure = calculateTenure("2020-01", "2022-06");
      expect(tenure).toBe("2 yrs 5 mos");
    });

    it("handles single month durations", () => {
      const tenure = calculateTenure("2022-01", "2022-02");
      expect(tenure).toBe("1 mo");
    });

    it("handles present end dates without errors", () => {
      const tenure = calculateTenure("2022-01", null);
      expect(tenure).toContain("yr");
    });
  });

  describe("getCustomerDisplayName (NDA Anonymization)", () => {
    it("shields real customer name when anonymizeCustomer is true", () => {
      const item = {
        customerName: "BP plc (Deepwater)",
        anonymizeCustomer: true,
        customerAlias: "Global Supermajor Energy Operator",
      };
      expect(getCustomerDisplayName(item)).toBe("Global Supermajor Energy Operator");
    });

    it("provides secure default placeholder if customer alias is blank but anonymization is true", () => {
      const item = {
        customerName: "Equinor Offshore",
        anonymizeCustomer: true,
        customerAlias: "",
      };
      expect(getCustomerDisplayName(item)).toBe("Confidential Industrial Client");
    });

    it("displays real customer name when anonymizeCustomer is false", () => {
      const item = {
        customerName: "Siemens Energy",
        anonymizeCustomer: false,
        customerAlias: "Tier-1 Industrial OEM",
      };
      expect(getCustomerDisplayName(item)).toBe("Siemens Energy");
    });
  });
});

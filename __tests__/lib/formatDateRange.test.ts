import { formatDateRange } from "@/lib/utils";

describe("formatDateRange", () => {
  it("formats same-month range", () => {
    const start = new Date(2026, 7, 3); // Aug 3
    const end = new Date(2026, 7, 9); // Aug 9
    const result = formatDateRange(start, end);
    expect(result).toMatch(/3 - 9/);
  });

  it("formats cross-month range", () => {
    const start = new Date(2026, 6, 28); // Jul 28
    const end = new Date(2026, 7, 3); // Aug 3
    const result = formatDateRange(start, end);
    expect(result).toMatch(/28.*3/);
  });
});

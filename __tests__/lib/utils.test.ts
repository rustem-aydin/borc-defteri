import { getStartOfWeek, getEndOfWeek } from "@/lib/utils";

describe("getStartOfWeek", () => {
  it("returns Monday for a Wednesday date", () => {
    // 2026-08-05 is a Wednesday
    const wednesday = new Date(2026, 7, 5);
    const result = getStartOfWeek(wednesday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(3); // Aug 3
  });

  it("returns Monday for a Sunday date", () => {
    // 2026-08-09 is a Sunday
    const sunday = new Date(2026, 7, 9);
    const result = getStartOfWeek(sunday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(3); // Aug 3
  });

  it("returns same day for a Monday date", () => {
    // 2026-08-03 is a Monday
    const monday = new Date(2026, 7, 3);
    const result = getStartOfWeek(monday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(3); // Aug 3
  });
});

describe("getEndOfWeek", () => {
  it("returns Sunday 6 days after Monday", () => {
    const monday = new Date(2026, 7, 3);
    const result = getEndOfWeek(monday);
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getDate()).toBe(9); // Aug 9
  });
});

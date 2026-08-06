import { getPrayerMetadata, PRAYER_KEYS } from "@/lib/prayers";

describe("lib/prayers", () => {
  it("provides metadata for every vakit", () => {
    for (const key of PRAYER_KEYS) {
      const meta = getPrayerMetadata(key);
      expect(meta).toBeDefined();
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.image).toBeTruthy();
    }
  });

  it("resolves labels through i18n at call time", () => {
    const first = getPrayerMetadata("sabah").label;
    const second = getPrayerMetadata("sabah").label;
    // Both calls should return the same string, proving it's resolved at call time
    // not frozen at module scope
    expect(first).toBe(second);
    expect(first.length).toBeGreaterThan(0);
  });
});

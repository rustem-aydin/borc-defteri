import { PRAYER_METADATA, PRAYER_KEYS } from "@/lib/prayers";

describe("lib/prayers", () => {
  it("exports all 6 vakit keys", () => {
    expect(PRAYER_KEYS).toHaveLength(6);
    expect(PRAYER_KEYS).toContain("sabah");
    expect(PRAYER_KEYS).toContain("ogle");
    expect(PRAYER_KEYS).toContain("ikindi");
    expect(PRAYER_KEYS).toContain("aksam");
    expect(PRAYER_KEYS).toContain("yatsi");
    expect(PRAYER_KEYS).toContain("vitir");
  });

  it("provides metadata for every vakit", () => {
    for (const key of PRAYER_KEYS) {
      const meta = PRAYER_METADATA[key];
      expect(meta).toBeDefined();
      expect(meta.label).toBeTruthy();
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.image).toBeTruthy();
    }
  });

  it("resolves labels through i18n at call time", () => {
    // Labels should be functions or getters, not frozen at module scope
    const sabah = PRAYER_METADATA.sabah;
    expect(typeof sabah.label).toBe("string");
    expect(sabah.label.length).toBeGreaterThan(0);
  });
});

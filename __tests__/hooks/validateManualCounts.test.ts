import { validateManualCounts } from "@/hooks/Usekazaform";

describe("validateManualCounts", () => {
  it("accepts zero counts", () => {
    const result = validateManualCounts({
      sabah: 0,
      ogle: 0,
      ikindi: 0,
      aksam: 0,
      yatsi: 0,
      vitir: 0,
    });
    expect(result.valid).toBe(true);
  });

  it("accepts positive counts", () => {
    const result = validateManualCounts({
      sabah: 100,
      ogle: 50,
      ikindi: 30,
      aksam: 20,
      yatsi: 10,
      vitir: 5,
    });
    expect(result.valid).toBe(true);
  });

  it("rejects negative counts", () => {
    const result = validateManualCounts({
      sabah: -1,
      ogle: 0,
      ikindi: 0,
      aksam: 0,
      yatsi: 0,
      vitir: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("negativeCountError");
  });

  it("rejects any negative count among positives", () => {
    const result = validateManualCounts({
      sabah: 100,
      ogle: -5,
      ikindi: 30,
      aksam: 20,
      yatsi: 10,
      vitir: 5,
    });
    expect(result.valid).toBe(false);
  });
});

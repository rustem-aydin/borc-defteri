import { calculate } from "@/hooks/Usekazaform";

describe("calculate", () => {
  it("returns zero for all vakitler when regular prayer date is before puberty", () => {
    const result = calculate({
      gender: "erkek",
      birthDate: new Date(2000, 0, 1),
      pubertyAge: 15,
      regularPrayerDate: new Date(2010, 0, 1), // before puberty (2015)
      monthlyHayzDays: 0,
      totalNifasDays: 0,
    });

    expect(result).toEqual({
      sabah: 0,
      ogle: 0,
      ikindi: 0,
      aksam: 0,
      yatsi: 0,
      vitir: 0,
    });
  });

  it("returns correct days for male with no exemptions", () => {
    const result = calculate({
      gender: "erkek",
      birthDate: new Date(2000, 0, 1),
      pubertyAge: 12,
      regularPrayerDate: new Date(2020, 0, 1),
      monthlyHayzDays: 0,
      totalNifasDays: 0,
    });

    // From 2012-01-01 to 2020-01-01 = 2921 days
    const expectedDays = 2921;
    expect(result.sabah).toBe(expectedDays);
    expect(result.ogle).toBe(expectedDays);
    expect(result.ikindi).toBe(expectedDays);
    expect(result.aksam).toBe(expectedDays);
    expect(result.yatsi).toBe(expectedDays);
    expect(result.vitir).toBe(expectedDays);
  });

  it("deducts hayz and nifas for female", () => {
    const result = calculate({
      gender: "kadin",
      birthDate: new Date(2000, 0, 1),
      pubertyAge: 12,
      regularPrayerDate: new Date(2020, 0, 1),
      monthlyHayzDays: 7,
      totalNifasDays: 40,
    });

    // Total days: 2921
    // Months: 2921 / 30 = 97.366...
    // Hayz deduction: 97.366... * 7 = 681.566... → 682 (rounded)
    // Nifas: 40
    // Result: 2921 - 682 - 40 = 2199
    expect(result.sabah).toBe(2199);
  });
});

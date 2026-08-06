import { parseDate } from "@/hooks/Usekazaform";

describe("parseDate", () => {
  it("parses valid DD.MM.YYYY format", () => {
    const result = parseDate("15.06.1990");
    expect(result).toEqual(new Date(1990, 5, 15));
  });

  it("returns null for empty string", () => {
    expect(parseDate("")).toBeNull();
  });

  it("returns null for missing parts", () => {
    expect(parseDate("15.06")).toBeNull();
  });

  it("returns null for invalid month", () => {
    expect(parseDate("15.13.1990")).toBeNull();
  });

  it("returns null for year before 1900", () => {
    expect(parseDate("15.06.1899")).toBeNull();
  });

  it("returns null for year after 2100", () => {
    expect(parseDate("15.06.2101")).toBeNull();
  });
});

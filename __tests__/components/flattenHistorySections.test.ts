import { flattenHistorySections } from "@/lib/historySections";
import type { GroupedLog } from "@/hooks/useHistoryQuery";

const log = (id: number) => ({
  id,
  tarih: new Date(2026, 10, 22, 8, id).toISOString(),
  islem: -1,
  vakit_id: "sabah",
});

const sections: GroupedLog[] = [
  { title: "22 Kasım Cumartesi", subtitle: "Bugün", data: [log(1), log(2)] },
  { title: "21 Kasım Cuma", subtitle: "Dün", data: [log(3)] },
  { title: "20 Kasım Perşembe", subtitle: "", data: [log(4)] },
];

describe("flattenHistorySections", () => {
  it("keeps section order and rows in their groups", () => {
    const items = flattenHistorySections(sections);

    expect(items.map((item) => item.type)).toEqual([
      "header",
      "row",
      "row",
      "header",
      "row",
      "header",
      "row",
    ]);

    const rows = items.flatMap((item) => (item.type === "row" ? [item.log.id] : []));
    expect(rows).toEqual([1, 2, 3, 4]);
  });

  it("marks first/last row so the card border renders on the right cells", () => {
    const items = flattenHistorySections(sections);
    const rows = items.flatMap((item) =>
      item.type === "row"
        ? [{ id: item.log.id, isFirst: item.isFirst, isLast: item.isLast }]
        : [],
    );

    expect(rows).toEqual([
      { id: 1, isFirst: true, isLast: false },
      { id: 2, isFirst: false, isLast: true },
      { id: 3, isFirst: true, isLast: true },
      { id: 4, isFirst: true, isLast: true },
    ]);
  });

  it("only the very first header loses its top margin", () => {
    const headers = flattenHistorySections(sections).flatMap((item) =>
      item.type === "header" ? [item.isFirst] : [],
    );

    expect(headers).toEqual([true, false, false]);
  });

  it("produces unique keys for the virtualized list", () => {
    const keys = flattenHistorySections(sections).map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

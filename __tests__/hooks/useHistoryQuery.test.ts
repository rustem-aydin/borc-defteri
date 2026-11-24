import { historyQueryOptions } from "@/hooks/useHistoryQuery";
import { i18n } from "@/lib/i18n";
import type { SQLiteDatabase } from "expo-sqlite";

const mockDb = {
  getAllAsync: jest.fn(),
};
// Test double: queryFn yalnız getAllAsync kullanıyor.
const db = mockDb as unknown as SQLiteDatabase;

describe("historyQueryOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 22, 12, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("reads only the displayed columns and the last 7 calendar days", async () => {
    mockDb.getAllAsync.mockResolvedValue([]);

    await historyQueryOptions(db).queryFn();

    const [sql, params] = mockDb.getAllAsync.mock.calls[0];
    expect(sql).toContain("SELECT id, tarih, islem, vakit_id FROM history_logs");
    expect(sql).not.toContain("SELECT *");
    // Eski satırlar hiç okunmaz: kesim noktası bugünden 6 gün önceki gece yarısı.
    expect(params).toEqual([new Date(2026, 10, 16, 0, 0, 0).toISOString()]);
  });

  it("groups today, yesterday and older days and drops older logs", async () => {
    const today = new Date(2026, 10, 22, 8, 0, 0);
    const yesterday = new Date(2026, 10, 21, 20, 0, 0);
    const threeDaysAgo = new Date(2026, 10, 19, 9, 0, 0);
    const tooOld = new Date(2026, 10, 10, 9, 0, 0);

    mockDb.getAllAsync.mockResolvedValue([
      { id: 1, tarih: today.toISOString(), islem: -1, vakit_id: "sabah" },
      { id: 2, tarih: yesterday.toISOString(), islem: 1, vakit_id: "ogle" },
      { id: 3, tarih: threeDaysAgo.toISOString(), islem: -1, vakit_id: "yatsi" },
      { id: 4, tarih: tooOld.toISOString(), islem: -1, vakit_id: "sabah" },
    ]);

    const sections = await historyQueryOptions(db).queryFn();

    expect(sections).toHaveLength(3);
    expect(sections[0].subtitle).toBe(i18n.t("today"));
    expect(sections[0].data.map((log) => log.id)).toEqual([1]);
    expect(sections[1].subtitle).toBe(i18n.t("yesterday"));
    expect(sections[1].data.map((log) => log.id)).toEqual([2]);
    expect(sections[2].subtitle).toBe("");
    expect(sections[2].data.map((log) => log.id)).toEqual([3]);
  });
});

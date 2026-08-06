import { migrateDbIfNeeded, PRAYER_KEYS } from "@/lib/db";

// Mock expo-sqlite
const mockDb = {
  getFirstAsync: jest.fn(),
  execAsync: jest.fn(),
  runAsync: jest.fn(),
};

jest.mock("expo-sqlite", () => ({
  SQLiteDatabase: jest.fn(),
}));

describe("lib/db", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("migrateDbIfNeeded", () => {
    it("creates tables and seeds prayers when version is 0", async () => {
      mockDb.getFirstAsync.mockResolvedValue({ user_version: 0 });

      await migrateDbIfNeeded(mockDb as any);

      // Should create tables
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS prayers"),
      );
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS history_logs"),
      );

      // Should seed all 6 prayers
      expect(mockDb.runAsync).toHaveBeenCalledTimes(PRAYER_KEYS.length);
      for (const key of PRAYER_KEYS) {
        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT OR IGNORE INTO prayers (vakit_id, kalan_sayi) VALUES (?, ?)",
          [key, 0],
        );
      }

      // Should set version to 1
      expect(mockDb.execAsync).toHaveBeenCalledWith("PRAGMA user_version = 1");
    });

    it("skips migration when version is already 1", async () => {
      mockDb.getFirstAsync.mockResolvedValue({ user_version: 1 });

      await migrateDbIfNeeded(mockDb as any);

      expect(mockDb.execAsync).not.toHaveBeenCalled();
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });
  });
});

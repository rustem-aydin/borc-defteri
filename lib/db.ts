import { SQLiteDatabase } from "expo-sqlite";

export const PRAYER_KEYS = [
  "sabah",
  "ogle",
  "ikindi",
  "aksam",
  "yatsi",
  "vitir",
];

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE IF NOT EXISTS prayers (
        vakit_id TEXT PRIMARY KEY,
        kalan_sayi INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS history_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tarih TEXT NOT NULL,
        islem INTEGER NOT NULL,
        vakit_id TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_history_logs_tarih
ON history_logs (tarih);
CREATE INDEX IF NOT EXISTS idx_history_logs_vakit_id
ON history_logs (vakit_id);
    `);

    // Varsayılan vakitleri oluştur
    for (const key of PRAYER_KEYS) {
      await db.runAsync(
        "INSERT OR IGNORE INTO prayers (vakit_id, kalan_sayi) VALUES (?, ?)",
        [key, 0],
      );
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  }
}

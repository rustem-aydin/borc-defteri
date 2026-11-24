import type { GroupedLog, HistoryLog } from "@/hooks/useHistoryQuery";

export type HistoryListItem =
  | {
      type: "header";
      key: string;
      title: string;
      subtitle: string;
      isFirst: boolean;
    }
  | {
      type: "row";
      key: string;
      log: HistoryLog;
      isFirst: boolean;
      isLast: boolean;
    };

/**
 * Gün gruplarını FlashList'in satır satır sanallaştırabileceği tek bir diziye
 * açar. `isFirst`/`isLast` kartın köşe ve kenarlıklarının doğru hücrelere
 * çizilmesini sağlar.
 */
export function flattenHistorySections(
  sections: GroupedLog[],
): HistoryListItem[] {
  const items: HistoryListItem[] = [];

  sections.forEach((section, sectionIndex) => {
    items.push({
      type: "header",
      key: `header-${section.title}`,
      title: section.title,
      subtitle: section.subtitle,
      isFirst: sectionIndex === 0,
    });

    section.data.forEach((log, rowIndex) => {
      items.push({
        type: "row",
        key: `row-${log.id}`,
        log,
        isFirst: rowIndex === 0,
        isLast: rowIndex === section.data.length - 1,
      });
    });
  });

  return items;
}

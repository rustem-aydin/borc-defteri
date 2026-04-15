import { i18n } from "./i18n";

export const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export const getEndOfWeek = (start: Date) => {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
};

export const formatDateRange = (start: Date, end: Date) => {
  const months = i18n.t("home.months") as string[];

  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]}`;
  }
  return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
};

import type { ProjectItem } from "@/data/resume";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function parseProjectDate(dateStr: string): Date {
  const parts = dateStr.replace(",", "").split(" ");
  const month = MONTHS.indexOf(parts[0].toLowerCase());

  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), month, parseInt(parts[1]));
  }
  return new Date(parseInt(parts[1]), month, 1);
}

export function sortProjectsByDate(
  projects: readonly ProjectItem[],
): ProjectItem[] {
  return projects
    .slice()
    .sort(
      (a, b) =>
        parseProjectDate(b.dates).getTime() -
        parseProjectDate(a.dates).getTime(),
    );
}

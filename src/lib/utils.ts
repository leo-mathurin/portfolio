import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, language: string = "en") {
  const currentDate = new Date().getTime();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date).getTime();
  const timeDifference = Math.abs(currentDate - targetDate);
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Use locale based on language
  const locale = language === "fr" ? "fr-FR" : "en-US";

  const fullDate = new Date(date).toLocaleString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // French relative time strings
  const frRelativeTime = {
    today: "Aujourd'hui",
    days: (days: number) => `${fullDate} (il y a ${days}j)`,
    weeks: (weeks: number) => `${fullDate} (il y a ${weeks}sem)`,
    months: (months: number) => `${fullDate} (il y a ${months}m)`,
    years: (years: number) => `${fullDate} (il y a ${years}a)`,
  };

  // English relative time strings
  const enRelativeTime = {
    today: "Today",
    days: (days: number) => `${fullDate} (${days}d ago)`,
    weeks: (weeks: number) => `${fullDate} (${weeks}w ago)`,
    months: (months: number) => `${fullDate} (${months}mo ago)`,
    years: (years: number) => `${fullDate} (${years}y ago)`,
  };

  // Select the appropriate language strings
  const relativeTime = language === "fr" ? frRelativeTime : enRelativeTime;

  if (daysAgo < 1) {
    return relativeTime.today;
  } else if (daysAgo < 7) {
    return relativeTime.days(daysAgo);
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return relativeTime.weeks(weeksAgo);
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return relativeTime.months(monthsAgo);
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return relativeTime.years(yearsAgo);
  }
}

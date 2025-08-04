import { format, isYesterday, isToday, parse } from "date-fns";

// Convert "7/9/2025" → Date object
const parseDate = (dateStr: string) => parse(dateStr, "M/d/yyyy", new Date());

export function updateStreak(logins: string[]): string[] {
  const today = new Date();
  const todayStr = format(today, "M/d/yyyy");

  // If already marked today, do nothing
  if (logins.includes(todayStr)) return logins;

  const lastLoginStr = logins[logins.length - 1];
  const lastLoginDate = parseDate(lastLoginStr);

  if (isYesterday(lastLoginDate)) {
    // Continue streak
    return [...logins, todayStr];
  } else {
    // Missed a day → reset streak
    return [todayStr];
  }
}

import { currentLocalDate, toDateKey } from './dates';

/**
 * Given the list of dates (YYYY-MM-DD strings) a habit was logged as done,
 * work out the current consecutive-day streak and whether it's done today.
 *
 * A streak stays "alive" through today even if today isn't checked off yet
 * (you still have until midnight), but breaks the moment a full day is missed.
 */
export function computeStreak(logDates: string[]): { streak: number; doneToday: boolean } {
  const logged = new Set(logDates);
  const today = currentLocalDate();
  const todayStr = toDateKey(today);
  const doneToday = logged.has(todayStr);

  let streak = 0;
  const cursor = new Date(today);
  if (!doneToday) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (logged.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { streak, doneToday };
}

import { sql } from '@/lib/db';
import { computeStreak } from '@/lib/streaks';
import HabitTracker from '@/components/HabitTracker';
import type { Habit, HabitWithStreak } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DailyTrackerPage() {
  const [habits, logs] = (await Promise.all([
    sql`select * from habits order by created_at asc`,
    sql`select habit_id, to_char(log_date, 'YYYY-MM-DD') as log_date from habit_logs`,
  ])) as [Habit[], { habit_id: number; log_date: string }[]];

  const logsByHabit = new Map<number, string[]>();
  for (const log of logs) {
    const existing = logsByHabit.get(log.habit_id) ?? [];
    existing.push(log.log_date);
    logsByHabit.set(log.habit_id, existing);
  }

  const habitsWithStreak: HabitWithStreak[] = habits.map((habit) => {
    const { streak, doneToday } = computeStreak(logsByHabit.get(habit.id) ?? []);
    return { ...habit, streak, doneToday };
  });

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Daily Tracker</h1>
        <p>Bible, books, gym, vitamins — whatever you check daily. Same list shown on Today.</p>
      </div>
      <HabitTracker habits={habitsWithStreak} />
    </div>
  );
}

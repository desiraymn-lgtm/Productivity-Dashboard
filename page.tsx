import { sql } from '@/lib/db';
import { computeStreak } from '@/lib/streaks';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import HabitTracker from '@/components/HabitTracker';
import QuickNotes from '@/components/QuickNotes';
import type { Task, Habit, Note, HabitWithStreak } from '@/lib/types';

// Always hit the database fresh — this is a personal dashboard, not a marketing page.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [tasks, habits, logs, notes] = (await Promise.all([
    sql`select * from tasks order by (status = 'done') asc, created_at desc`,
    sql`select * from habits order by created_at asc`,
    sql`select habit_id, to_char(log_date, 'YYYY-MM-DD') as log_date from habit_logs`,
    sql`select * from notes order by created_at desc`,
  ])) as [Task[], Habit[], { habit_id: number; log_date: string }[], Note[]];

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

  const openTasks = tasks.filter((t) => t.status === 'open').length;
  const habitsDoneToday = habitsWithStreak.filter((h) => h.doneToday).length;

  return (
    <main className="dashboard">
      <Sidebar
        openTasks={openTasks}
        totalTasks={tasks.length}
        habitsDone={habitsDoneToday}
        habitsTotal={habits.length}
        notesCount={notes.length}
      />
      <div className="board">
        <TaskList tasks={tasks} />
        <HabitTracker habits={habitsWithStreak} />
        <QuickNotes notes={notes} />
      </div>
    </main>
  );
}

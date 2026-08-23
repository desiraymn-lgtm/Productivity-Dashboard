'use client';

import { useState } from 'react';
import { toggleHabitToday, deleteHabit } from '@/app/actions';
import AddHabitForm from './AddHabitForm';
import type { HabitWithStreak } from '@/lib/types';

export default function DailyChecklist({ habits }: { habits: HabitWithStreak[] }) {
  const [localDone, setLocalDone] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(habits.map((h) => [h.id, h.doneToday]))
  );

  const doneCount = habits.filter((h) => localDone[h.id] ?? h.doneToday).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <>
      <div className="daily-progress">
        <div className="daily-progress-ring" style={{ '--pct': pct } as React.CSSProperties}>
          <span>
            {doneCount}/{total}
          </span>
        </div>
        <div className="daily-progress-text">
          <h2>{total > 0 && doneCount === total ? "Today's checklist — all done" : "Today's checklist"}</h2>
          <p>
            {total === 0
              ? 'Add your first daily task below.'
              : doneCount === total
              ? 'Every task checked off today.'
              : `${total - doneCount} left for today.`}
          </p>
        </div>
      </div>

      <AddHabitForm />

      {habits.length === 0 && <p className="empty">No daily tasks yet. Add one above.</p>}

      <div className="daily-list">
        {habits.map((habit) => {
          const isDone = localDone[habit.id] ?? habit.doneToday;
          const deleteWithId = deleteHabit.bind(null, habit.id);

          return (
            <div key={habit.id} className={`daily-row${isDone ? ' is-done' : ''}`}>
              <button
                type="button"
                className={`daily-checkbox${isDone ? ' is-checked' : ''}`}
                aria-label={isDone ? 'Mark as not done today' : 'Mark as done today'}
                onClick={() => {
                  const wasDone = habit.doneToday;
                  setLocalDone((prev) => ({ ...prev, [habit.id]: !isDone }));
                  toggleHabitToday(habit.id, wasDone);
                }}
              >
                {isDone ? '✓' : ''}
              </button>

              <div className="daily-row-body">
                <span className="daily-row-name">{habit.name}</span>
                <span className="daily-row-streak">
                  {habit.streak > 0 ? `${habit.streak} day streak` : 'Start your streak today'}
                </span>
              </div>

              <form action={deleteWithId}>
                <button type="submit" className="row-delete" aria-label="Delete daily task">
                  ×
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </>
  );
}

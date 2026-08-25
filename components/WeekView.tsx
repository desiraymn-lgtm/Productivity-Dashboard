'use client';

import { useState } from 'react';
import { toggleHabitLogDate } from '@/app/actions';
import { currentLocalDate, toDateKey } from '@/lib/dates';
import type { HabitWithStreak } from '@/lib/types';

function lastNDays(n: number): { key: string; label: string; isToday: boolean }[] {
  const days: { key: string; label: string; isToday: boolean }[] = [];
  const today = currentLocalDate();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      key: toDateKey(d),
      label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      isToday: i === 0,
    });
  }
  return days;
}

export default function WeekView({
  habits,
  logsByHabit,
}: {
  habits: HabitWithStreak[];
  logsByHabit: Record<number, string[]>;
}) {
  const days = lastNDays(7);
  const [localLogs, setLocalLogs] = useState<Record<number, Set<string>>>(() =>
    Object.fromEntries(habits.map((h) => [h.id, new Set(logsByHabit[h.id] ?? [])]))
  );

  if (habits.length === 0) {
    return <p className="empty">No daily tasks yet.</p>;
  }

  function isDone(habitId: number, dayKey: string) {
    return localLogs[habitId]?.has(dayKey) ?? false;
  }

  function handleToggle(habitId: number, dayKey: string) {
    const wasDone = isDone(habitId, dayKey);
    setLocalLogs((prev) => {
      const next = new Set(prev[habitId]);
      if (wasDone) next.delete(dayKey);
      else next.add(dayKey);
      return { ...prev, [habitId]: next };
    });
    toggleHabitLogDate(habitId, dayKey, wasDone);
  }

  return (
    <div className="week-grid-wrap">
      <table className="week-grid">
        <thead>
          <tr>
            <th className="week-grid-habit-col">Task</th>
            {days.map((day) => (
              <th key={day.key} className={day.isToday ? 'is-today' : ''}>
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td className="week-grid-habit-col">{habit.name}</td>
              {days.map((day) => {
                const done = isDone(habit.id, day.key);
                return (
                  <td key={day.key}>
                    <button
                      type="button"
                      className={`week-cell${done ? ' is-checked' : ''}${day.isToday ? ' is-today' : ''}`}
                      aria-label={`${habit.name} — ${day.label}`}
                      onClick={() => handleToggle(habit.id, day.key)}
                    >
                      {done ? '✓' : ''}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

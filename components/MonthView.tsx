'use client';

import { useState } from 'react';
import { toDateKey } from '@/lib/dates';
import type { HabitWithStreak } from '@/lib/types';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MonthView({
  habits,
  logsByHabit,
}: {
  habits: HabitWithStreak[];
  logsByHabit: Record<number, string[]>;
}) {
  const [monthOffset, setMonthOffset] = useState(0);

  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + monthOffset);
  const year = base.getFullYear();
  const month = base.getMonth();

  const monthLabel = base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const doneByDate = new Map<string, number>();
  for (const habit of habits) {
    for (const dateKey of logsByHabit[habit.id] ?? []) {
      doneByDate.set(dateKey, (doneByDate.get(dateKey) ?? 0) + 1);
    }
  }

  const total = habits.length;
  const todayKey = toDateKey(new Date());

  const cells: { key: string | null; day: number | null; pct: number; isToday: boolean }[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ key: null, day: null, pct: 0, isToday: false });
  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(new Date(year, month, day));
    const done = doneByDate.get(key) ?? 0;
    cells.push({ key, day, pct: total > 0 ? done / total : 0, isToday: key === todayKey });
  }

  return (
    <div className="month-view">
      <div className="month-nav">
        <button type="button" onClick={() => setMonthOffset((o) => o - 1)} aria-label="Previous month">
          ‹
        </button>
        <span>{monthLabel}</span>
        <button type="button" onClick={() => setMonthOffset((o) => o + 1)} aria-label="Next month">
          ›
        </button>
      </div>

      {total === 0 ? (
        <p className="empty">No daily tasks yet.</p>
      ) : (
        <>
          <div className="month-grid month-grid-labels">
            {WEEKDAY_LABELS.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
          <div className="month-grid">
            {cells.map((cell, i) =>
              cell.day == null ? (
                <span key={i} className="month-cell is-empty" />
              ) : (
                <span
                  key={i}
                  className={`month-cell${cell.isToday ? ' is-today' : ''}`}
                  style={{ '--pct': cell.pct } as React.CSSProperties}
                  title={`${cell.day}: ${Math.round(cell.pct * 100)}% done`}
                >
                  {cell.day}
                </span>
              )
            )}
          </div>
          <p className="month-legend">Darker = more of the day&apos;s tasks checked off.</p>
        </>
      )}
    </div>
  );
}

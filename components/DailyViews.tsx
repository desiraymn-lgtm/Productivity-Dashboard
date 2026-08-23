'use client';

import { useState } from 'react';
import DailyChecklist from './DailyChecklist';
import WeekView from './WeekView';
import MonthView from './MonthView';
import type { HabitWithStreak } from '@/lib/types';

type View = 'day' | 'week' | 'month';
const VIEWS: View[] = ['day', 'week', 'month'];

export default function DailyViews({
  habits,
  logsByHabit,
}: {
  habits: HabitWithStreak[];
  logsByHabit: Record<number, string[]>;
}) {
  const [view, setView] = useState<View>('day');

  return (
    <>
      <div className="view-switch">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            className={`view-switch-btn${view === v ? ' is-active' : ''}`}
            onClick={() => setView(v)}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {view === 'day' && <DailyChecklist habits={habits} />}
      {view === 'week' && <WeekView habits={habits} logsByHabit={logsByHabit} />}
      {view === 'month' && <MonthView habits={habits} logsByHabit={logsByHabit} />}
    </>
  );
}

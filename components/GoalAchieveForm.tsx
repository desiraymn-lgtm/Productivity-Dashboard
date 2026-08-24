'use client';

import { markGoalAchieved } from '@/app/actions';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function GoalAchieveForm({ goalId }: { goalId: number }) {
  const now = new Date();
  const saveWithId = markGoalAchieved.bind(null, goalId);
  const years = Array.from({ length: 8 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <form action={saveWithId} className="add-form" style={{ marginTop: 8 }}>
      <select name="month" defaultValue={now.getMonth() + 1} aria-label="Month achieved">
        {MONTHS.map((month, i) => (
          <option key={month} value={i + 1}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" defaultValue={now.getFullYear()} aria-label="Year achieved">
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button type="submit">Mark as achieved</button>
    </form>
  );
}

'use client';

import { updateGoalCategory } from '@/app/actions';
import { GOAL_CATEGORIES } from '@/lib/types';
import type { GoalCategory } from '@/lib/types';

export default function GoalCategorySelect({ goalId, category }: { goalId: number; category: GoalCategory | null }) {
  return (
    <select
      className="goal-category-select"
      defaultValue={category ?? ''}
      onChange={(e) => {
        updateGoalCategory(goalId, e.target.value);
      }}
      aria-label="Category"
    >
      <option value="">Uncategorized</option>
      {GOAL_CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

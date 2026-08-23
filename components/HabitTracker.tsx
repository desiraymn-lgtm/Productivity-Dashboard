import { toggleHabitToday, deleteHabit } from '@/app/actions';
import AddHabitForm from './AddHabitForm';
import type { HabitWithStreak } from '@/lib/types';

export default function HabitTracker({ habits }: { habits: HabitWithStreak[] }) {
  const doneToday = habits.filter((h) => h.doneToday).length;

  return (
    <section className="card">
      <div className="card-head">
        <h2>Habits</h2>
        <span className="tally">
          {doneToday}/{habits.length} today
        </span>
      </div>

      <AddHabitForm />

      {habits.length === 0 && <p className="empty">No habits yet. Add one to start a streak.</p>}

      <ul className="habit-list">
        {habits.map((habit) => {
          const toggleWithId = toggleHabitToday.bind(null, habit.id, habit.doneToday);
          const deleteWithId = deleteHabit.bind(null, habit.id);

          return (
            <li key={habit.id} className="habit-row">
              <form action={toggleWithId}>
                <button
                  type="submit"
                  className={`checkbox${habit.doneToday ? ' is-checked' : ''}`}
                  aria-label={habit.doneToday ? 'Mark as not done today' : 'Mark as done today'}
                >
                  {habit.doneToday ? '✓' : ''}
                </button>
              </form>

              <div className="habit-body">
                <span className="habit-name">{habit.name}</span>
                <span className="habit-streak">
                  <span className="tally-marks" aria-hidden="true">
                    {'|'.repeat(Math.min(habit.streak, 12))}
                  </span>
                  {habit.streak > 0 ? `${habit.streak} day streak` : 'no streak yet'}
                </span>
              </div>

              <form action={deleteWithId}>
                <button type="submit" className="row-delete" aria-label="Delete habit">
                  ×
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

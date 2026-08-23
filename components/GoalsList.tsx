import { toggleGoalStatus, deleteGoal } from '@/app/actions';
import type { Goal } from '@/lib/types';

export default function GoalsList({ goals }: { goals: Goal[] }) {
  const active = goals.filter((g) => g.status === 'active');
  const achieved = goals.filter((g) => g.status === 'achieved');

  return (
    <>
      <h2 className="section-title">Active Goals</h2>
      {active.length === 0 && <p className="empty">No active goals yet — add one above.</p>}
      <div className="prospect-grid">
        {active.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      <h2 className="section-title">Achieved</h2>
      {achieved.length === 0 && <p className="empty">Nothing here yet — mark a goal achieved and it&apos;ll move here.</p>}
      <div className="prospect-grid">
        {achieved.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const toggleWithId = toggleGoalStatus.bind(null, goal.id, goal.status);
  const deleteWithId = deleteGoal.bind(null, goal.id);
  const isAchieved = goal.status === 'achieved';

  return (
    <div className={`prospect-card${isAchieved ? ' is-achieved' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="prospect-name">{goal.title}</span>
        <form action={deleteWithId}>
          <button type="submit" className="row-delete" aria-label="Delete goal">
            ×
          </button>
        </form>
      </div>
      {goal.notes && <p className="book-notes">{goal.notes}</p>}
      {isAchieved && goal.achieved_at && <span className="prospect-meta">Achieved {formatDate(goal.achieved_at)}</span>}
      <form action={toggleWithId}>
        <button
          type="submit"
          className={`status-pill status-${isAchieved ? 'finished' : 'want'}`}
          style={{ border: 'none', cursor: 'pointer', marginTop: 4 }}
        >
          {isAchieved ? '✓ Achieved — move back to active' : 'Mark as achieved'}
        </button>
      </form>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

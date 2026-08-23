import { cycleTiktokStatus, deleteTiktokIdea } from '@/app/actions';
import type { TiktokIdea } from '@/lib/types';

const STATUS_LABEL: Record<string, string> = {
  idea: 'Idea',
  planned: 'Planned',
  posted: 'Posted',
};

export default function TiktokBoard({ ideas }: { ideas: TiktokIdea[] }) {
  if (ideas.length === 0) {
    return <p className="empty">No ideas logged yet — add your first one above.</p>;
  }

  const pillars = Array.from(new Set(ideas.map((idea) => idea.pillar)));

  return (
    <div className="pillar-board">
      {pillars.map((pillar) => (
        <div key={pillar} className="pillar-column">
          <h3>{pillar}</h3>
          {ideas
            .filter((idea) => idea.pillar === pillar)
            .map((idea) => {
              const cycleWithId = cycleTiktokStatus.bind(null, idea.id, idea.status);
              const deleteWithId = deleteTiktokIdea.bind(null, idea.id);
              return (
                <div key={idea.id} className="idea-card">
                  <div className="idea-card-top">
                    <span>{idea.idea}</span>
                    <form action={deleteWithId}>
                      <button type="submit" className="row-delete" aria-label="Delete idea">
                        ×
                      </button>
                    </form>
                  </div>
                  <form action={cycleWithId}>
                    <button type="submit" className={`status-pill status-${statusClass(idea.status)}`}>
                      {STATUS_LABEL[idea.status]} — tap to advance
                    </button>
                  </form>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}

function statusClass(status: string): string {
  if (status === 'posted') return 'finished';
  if (status === 'planned') return 'reading';
  return 'want';
}

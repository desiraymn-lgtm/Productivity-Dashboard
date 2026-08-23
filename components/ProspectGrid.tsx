import { updateProspectStage, deleteProspect } from '@/app/actions';
import type { BusinessProspect, ProspectStage } from '@/lib/types';

const STAGES: ProspectStage[] = ['researching', 'contacted', 'reviewing', 'passed'];
const STAGE_LABEL: Record<ProspectStage, string> = {
  researching: 'Researching',
  contacted: 'Contacted',
  reviewing: 'Reviewing',
  passed: 'Passed',
};

export default function ProspectGrid({ prospects }: { prospects: BusinessProspect[] }) {
  if (prospects.length === 0) {
    return <p className="empty">No prospects logged yet.</p>;
  }

  return (
    <div className="prospect-grid">
      {prospects.map((prospect) => {
        const deleteWithId = deleteProspect.bind(null, prospect.id);
        return (
          <div key={prospect.id} className="prospect-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="prospect-name">{prospect.business_name}</span>
              <form action={deleteWithId}>
                <button type="submit" className="row-delete" aria-label="Delete prospect">
                  ×
                </button>
              </form>
            </div>
            {prospect.industry && <span className="prospect-meta">{prospect.industry}</span>}
            {prospect.notes && <p className="book-notes">{prospect.notes}</p>}
            <div className="add-form" style={{ marginTop: 4 }}>
              {STAGES.map((stage) => {
                const setStage = updateProspectStage.bind(null, prospect.id, stage);
                const isCurrent = prospect.stage === stage;
                return (
                  <form key={stage} action={setStage}>
                    <button
                      type="submit"
                      className="row-delete"
                      style={{
                        width: 'auto',
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: isCurrent ? 700 : 400,
                        color: isCurrent ? 'var(--burgundy)' : 'var(--muted)',
                      }}
                      disabled={isCurrent}
                    >
                      {STAGE_LABEL[stage]}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

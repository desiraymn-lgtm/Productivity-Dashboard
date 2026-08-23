type SidebarProps = {
  openTasks: number;
  totalTasks: number;
  habitsDone: number;
  habitsTotal: number;
  notesCount: number;
};

export default function Sidebar({ openTasks, totalTasks, habitsDone, habitsTotal, notesCount }: SidebarProps) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <aside className="sidebar">
      <div className="ledger-head">
        <span className="ledger-eyebrow">
          Entry No. {dayOfYear(today)} / {today.getFullYear()}
        </span>
        <h1 className="ledger-date">{dateLabel}</h1>
        <div className="ledger-rule" aria-hidden="true" />
      </div>

      <dl className="stat-block">
        <div className="stat-row">
          <dt>Tasks open</dt>
          <dd>
            {openTasks}
            <span className="stat-of"> / {totalTasks}</span>
          </dd>
        </div>
        <div className="stat-row">
          <dt>Habits today</dt>
          <dd>
            {habitsDone}
            <span className="stat-of"> / {habitsTotal}</span>
          </dd>
        </div>
        <div className="stat-row">
          <dt>Notes kept</dt>
          <dd>{notesCount}</dd>
        </div>
      </dl>

      <p className="ledger-footer">
        Every line here is written by you — nothing carries over unless you check it off.
      </p>
    </aside>
  );
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

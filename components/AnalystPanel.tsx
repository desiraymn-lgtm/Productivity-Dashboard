'use client';

import { useState, useTransition } from 'react';
import { deleteBrief, generateBrief } from '@/app/investing/actions';
import { RichText } from '@/lib/richtext';
import type { BriefKind, InvestingBrief } from '@/lib/investing';

const TABS: { kind: BriefKind; label: string; button: string; blurb: string }[] = [
  {
    kind: 'portfolio',
    label: 'What to buy',
    button: 'Review my portfolio',
    blurb: 'Reviews every account against your targets and gives a concrete buy plan for next month.',
  },
  {
    kind: 'ipo',
    label: 'IPO pipeline',
    button: 'Find upcoming IPOs',
    blurb: 'Searches recent filings and reports for private companies expected to go public soon.',
  },
  {
    kind: 'market',
    label: 'Market reading',
    button: 'Read the market',
    blurb: 'Indices, rates, the Fed, crypto, and the upcoming events that matter — tied back to your holdings.',
  },
  {
    kind: 'ask',
    label: 'Ask',
    button: 'Ask the analyst',
    blurb: 'Ask anything — the analyst sees your holdings and can search the web.',
  },
];

export default function AnalystPanel({ briefs, configured }: { briefs: InvestingBrief[]; configured: boolean }) {
  const [tab, setTab] = useState<BriefKind>('portfolio');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingKind, setPendingKind] = useState<BriefKind | null>(null);
  const [isPending, startTransition] = useTransition();

  const active = TABS.find((t) => t.kind === tab)!;
  const forTab = briefs.filter((b) => b.kind === tab);
  const [latest, ...older] = forTab;

  function run() {
    setError(null);
    setPendingKind(tab);
    const kind = tab;
    startTransition(async () => {
      const result = await generateBrief(kind, kind === 'ask' ? question : undefined);
      if (!result.ok) setError(result.error);
      else if (kind === 'ask') setQuestion('');
      setPendingKind(null);
    });
  }

  return (
    <div className="inv-section inv-analyst">
      <div className="card-head">
        <h2>AI analyst</h2>
        <span className="tally">researches live with web search</span>
      </div>

      <div className="inv-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.kind}
            type="button"
            role="tab"
            aria-selected={tab === t.kind}
            className={`inv-tab${tab === t.kind ? ' is-active' : ''}`}
            onClick={() => {
              setTab(t.kind);
              setError(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="inv-note">{active.blurb}</p>

      {!configured && (
        <p className="inv-warning">
          The analyst is off. Add an <code>ANTHROPIC_API_KEY</code> environment variable (in <code>.env.local</code>{' '}
          locally, and in Vercel → Settings → Environment Variables), then redeploy.
        </p>
      )}

      <div className="inv-run-row">
        {tab === 'ask' && (
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Should I put my next $1,000 in VXUS or keep building cash? Is now a good time to add to bitcoin?"
            aria-label="Question for the analyst"
          />
        )}
        <button type="button" className="inv-run" onClick={run} disabled={isPending || !configured}>
          {isPending && pendingKind === tab ? 'Researching… (1–3 min)' : active.button}
        </button>
      </div>

      {isPending && pendingKind !== tab && pendingKind && (
        <p className="inv-note">Still working on the {TABS.find((t) => t.kind === pendingKind)?.label} report…</p>
      )}
      {error && <p className="inv-warning">{error}</p>}

      {latest ? (
        <BriefView brief={latest} />
      ) : (
        <p className="empty">No {active.label.toLowerCase()} reports yet.</p>
      )}

      {older.length > 0 && (
        <details className="inv-history">
          <summary>Earlier reports ({older.length})</summary>
          {older.map((b) => (
            <details key={b.id} className="inv-history-item">
              <summary>
                {formatStamp(b.created_at)}
                {b.question ? ` — ${b.question.slice(0, 80)}` : ''}
              </summary>
              <BriefView brief={b} />
            </details>
          ))}
        </details>
      )}
    </div>
  );
}

function BriefView({ brief }: { brief: InvestingBrief }) {
  return (
    <article className="inv-brief">
      <div className="inv-brief-meta">
        <span>{formatStamp(brief.created_at)}</span>
        <form action={deleteBrief.bind(null, brief.id)}>
          <button type="submit" className="row-delete" aria-label="Delete report">
            ×
          </button>
        </form>
      </div>
      {brief.question && <p className="inv-question">“{brief.question}”</p>}
      <div className="richtext">
        <RichText content={brief.content} />
      </div>
      {brief.sources.length > 0 && (
        <details className="inv-sources">
          <summary>Sources ({brief.sources.length})</summary>
          <ul>
            {brief.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}

function formatStamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

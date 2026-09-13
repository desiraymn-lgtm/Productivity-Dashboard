'use client';

import { useState } from 'react';
import { updateCoastFiAssumptions } from '@/app/actions';
import type { CoastFiAssumptions } from '@/lib/types';

export function coastNumberNeeded(a: CoastFiAssumptions): number {
  const r = Number(a.annual_return_pct) / 100;
  const spend = Number(a.target_annual_spend);
  const yearsToRetirement = 65 - a.target_age;
  const coastAt65 = spend * 25;
  return coastAt65 / Math.pow(1 + r, yearsToRetirement);
}

const inputStyle: React.CSSProperties = {
  background: 'var(--ivory)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '6px 8px',
  fontSize: 13,
  width: '100%',
};

export default function CoastFiSummary({ assumptions }: { assumptions: CoastFiAssumptions }) {
  const [isEditing, setIsEditing] = useState(false);
  const target = coastNumberNeeded(assumptions);

  return (
    <div className="plan-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2>Coast FI Tracker — Coast by {assumptions.target_age}</h2>
        <button type="button" className="plan-edit-toggle" onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form
          action={async (formData: FormData) => {
            await updateCoastFiAssumptions(formData);
            setIsEditing(false);
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 12 }}>
            <Field label="Current age" name="currentAge" defaultValue={assumptions.current_age} step="1" />
            <Field label="Coast FI target age" name="targetAge" defaultValue={assumptions.target_age} step="1" />
            <Field label="Base year (for current age)" name="baseYear" defaultValue={assumptions.base_year} step="1" />
            <Field label="Assumed annual return (%)" name="annualReturnPct" defaultValue={assumptions.annual_return_pct} step="0.1" />
            <Field
              label="Target annual spend at retirement ($)"
              name="targetAnnualSpend"
              defaultValue={assumptions.target_annual_spend}
              step="1"
            />
            <Field
              label="Current combined retirement balance ($)"
              name="currentBalance"
              defaultValue={assumptions.current_balance}
              step="1"
            />
            <Field
              label="Annual contribution target ($)"
              name="annualContributionTarget"
              defaultValue={assumptions.annual_contribution_target}
              step="1"
            />
          </div>
          <div className="save-row" style={{ marginTop: 14 }}>
            <button type="submit">Save</button>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
            Goal: reach your Coast FI number by age {assumptions.target_age} through consistent monthly contributions.
          </p>
          <div
            style={{
              background: 'var(--sage)',
              color: 'var(--ivory)',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
            }}
          >
            <span>Coast Number Needed (by age {assumptions.target_age})</span>
            <span>{money(target)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  step: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--muted)' }}>
      {label}
      <input type="number" name={name} step={step} defaultValue={defaultValue} style={inputStyle} />
    </label>
  );
}

function money(v: number): string {
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

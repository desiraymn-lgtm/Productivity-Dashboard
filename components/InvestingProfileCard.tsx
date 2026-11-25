'use client';

import { useState } from 'react';
import { updateInvestingProfile } from '@/app/investing/actions';
import { formatMoney, type InvestingProfile } from '@/lib/investing';

const TARGETS: { name: string; key: keyof InvestingProfile; label: string }[] = [
  { name: 'targetUsStock', key: 'target_us_stock', label: 'US stocks %' },
  { name: 'targetIntlStock', key: 'target_intl_stock', label: 'International %' },
  { name: 'targetBond', key: 'target_bond', label: 'Bonds %' },
  { name: 'targetReit', key: 'target_reit', label: 'REITs %' },
  { name: 'targetCrypto', key: 'target_crypto', label: 'Crypto %' },
  { name: 'targetCash', key: 'target_cash', label: 'Cash %' },
];

export default function InvestingProfileCard({ profile }: { profile: InvestingProfile }) {
  const [editing, setEditing] = useState(false);
  const targetSum = TARGETS.reduce((s, t) => s + Number(profile[t.key]), 0);

  return (
    <div className="plan-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2>Plan &amp; targets</h2>
        <button type="button" className="plan-edit-toggle" onClick={() => setEditing((v) => !v)}>
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form
          action={async (fd: FormData) => {
            await updateInvestingProfile(fd);
            setEditing(false);
          }}
        >
          <div className="inv-field-grid">
            <label className="inv-field">
              Risk tolerance
              <select name="riskTolerance" defaultValue={profile.risk_tolerance}>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="moderate-aggressive">Moderate-aggressive</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </label>
            <Field label="Time horizon (years)" name="horizonYears" value={profile.horizon_years} />
            <Field label="Monthly → Brokerage $" name="monthlyBrokerage" value={Number(profile.monthly_brokerage)} />
            <Field label="Monthly → Roth IRA $" name="monthlyRoth" value={Number(profile.monthly_roth)} />
            <Field label="Monthly → Crypto $" name="monthlyCrypto" value={Number(profile.monthly_crypto)} />
            {TARGETS.map((t) => (
              <Field key={t.name} label={t.label} name={t.name} value={Number(profile[t.key])} />
            ))}
          </div>
          <textarea
            name="notes"
            defaultValue={profile.notes ?? ''}
            placeholder="Anything the analyst should know — goals, companies you like, things to avoid, upcoming big expenses…"
          />
          <button type="submit">
            Save
          </button>
        </form>
      ) : (
        <div className="inv-profile-view">
          <p>
            <strong>{profile.risk_tolerance}</strong> · {profile.horizon_years}-year horizon · investing{' '}
            {formatMoney(Number(profile.monthly_brokerage))} brokerage, {formatMoney(Number(profile.monthly_roth))} Roth
            IRA, {formatMoney(Number(profile.monthly_crypto))} crypto each month
          </p>
          <p>
            Targets:{' '}
            {TARGETS.map((t) => `${t.label.replace(' %', '')} ${profile[t.key]}%`).join(' · ')}
            {targetSum !== 100 && <strong className="inv-down"> — targets add up to {targetSum}%, not 100%</strong>}
          </p>
          {profile.notes && <p className="inv-sub">{profile.notes}</p>}
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: number }) {
  return (
    <label className="inv-field">
      {label}
      <input name={name} defaultValue={value} inputMode="decimal" />
    </label>
  );
}

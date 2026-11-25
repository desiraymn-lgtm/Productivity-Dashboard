'use server';

import { revalidatePath } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';
import { sql } from '@/lib/db';
import { loadInvestingData } from '@/lib/investingData';
import { isBotConfigured, runInvestingBot } from '@/lib/investingBot';
import type { BriefKind } from '@/lib/investing';

const PATH = '/investing';

function text(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? '').trim();
  return value.length > 0 ? value : null;
}

function num(formData: FormData, key: string): number | null {
  const raw = text(formData, key);
  if (raw === null) return null;
  const value = Number(raw.replace(/[$,]/g, ''));
  return Number.isFinite(value) ? value : null;
}

// ---------- Holdings ----------

export async function addHolding(formData: FormData) {
  const symbol = text(formData, 'symbol')?.toUpperCase();
  const account = text(formData, 'account');
  if (!symbol || !account) return;
  const assetClass = text(formData, 'assetClass') ?? (account === 'crypto' ? 'crypto' : 'us_stock');

  await sql`
    insert into investment_holdings (account, symbol, name, asset_class, quantity, cost_basis, manual_price)
    values (${account}, ${symbol}, ${text(formData, 'name')}, ${assetClass}, ${num(formData, 'quantity') ?? 0},
            ${num(formData, 'costBasis')}, ${num(formData, 'manualPrice')})
  `;
  revalidatePath(PATH);
}

export async function updateHolding(id: number, formData: FormData) {
  await sql`
    update investment_holdings
    set quantity = ${num(formData, 'quantity') ?? 0},
        cost_basis = ${num(formData, 'costBasis')},
        manual_price = ${num(formData, 'manualPrice')}
    where id = ${id}
  `;
  revalidatePath(PATH);
}

export async function deleteHolding(id: number) {
  await sql`delete from investment_holdings where id = ${id}`;
  revalidatePath(PATH);
}

// ---------- Profile / targets ----------

export async function updateInvestingProfile(formData: FormData) {
  const t = (k: string) => Math.max(0, Math.round(num(formData, k) ?? 0));
  await sql`
    update investing_profile set
      risk_tolerance = ${text(formData, 'riskTolerance') ?? 'moderate-aggressive'},
      horizon_years = ${t('horizonYears')},
      monthly_brokerage = ${num(formData, 'monthlyBrokerage') ?? 0},
      monthly_roth = ${num(formData, 'monthlyRoth') ?? 0},
      monthly_crypto = ${num(formData, 'monthlyCrypto') ?? 0},
      target_us_stock = ${t('targetUsStock')},
      target_intl_stock = ${t('targetIntlStock')},
      target_bond = ${t('targetBond')},
      target_reit = ${t('targetReit')},
      target_crypto = ${t('targetCrypto')},
      target_cash = ${t('targetCash')},
      notes = ${text(formData, 'notes')}
    where id = 1
  `;
  revalidatePath(PATH);
}

// ---------- IPO watchlist ----------

export async function addIpoWatch(formData: FormData) {
  const company = text(formData, 'company');
  if (!company) return;
  await sql`
    insert into ipo_watchlist (company, sector, expected_timing, est_valuation, status, notes)
    values (${company}, ${text(formData, 'sector')}, ${text(formData, 'expectedTiming')},
            ${text(formData, 'estValuation')}, ${text(formData, 'status') ?? 'rumored'}, ${text(formData, 'notes')})
  `;
  revalidatePath(PATH);
}

export async function setIpoStatus(id: number, formData: FormData) {
  const status = text(formData, 'status');
  if (!status) return;
  await sql`update ipo_watchlist set status = ${status} where id = ${id}`;
  revalidatePath(PATH);
}

export async function deleteIpoWatch(id: number) {
  await sql`delete from ipo_watchlist where id = ${id}`;
  revalidatePath(PATH);
}

// ---------- AI analyst ----------

export type BriefResult = { ok: true } | { ok: false; error: string };

export async function generateBrief(kind: BriefKind, question?: string): Promise<BriefResult> {
  if (!isBotConfigured()) {
    return { ok: false, error: 'Add ANTHROPIC_API_KEY to your environment variables to turn on the analyst.' };
  }
  const q = question?.trim();
  if (kind === 'ask' && !q) return { ok: false, error: 'Type a question first.' };

  try {
    const data = await loadInvestingData();
    const result = await runInvestingBot(
      kind,
      { profile: data.profile, holdings: data.priced, allocation: data.allocation, total: data.total, watchlist: data.watchlist },
      q
    );
    await sql`
      insert into investing_briefs (kind, question, content, sources)
      values (${kind}, ${q ?? null}, ${result.content}, ${JSON.stringify(result.sources)}::jsonb)
    `;
    revalidatePath(PATH);
    return { ok: true };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, error: 'Your ANTHROPIC_API_KEY was rejected. Check the key in your environment variables.' };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { ok: false, error: 'Rate limited by the Claude API. Wait a minute and try again.' };
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, error: `Claude API error (${error.status ?? 'network'}): ${error.message}` };
    }
    return { ok: false, error: error instanceof Error ? error.message : 'Something went wrong.' };
  }
}

export async function deleteBrief(id: number) {
  await sql`delete from investing_briefs where id = ${id}`;
  revalidatePath(PATH);
}

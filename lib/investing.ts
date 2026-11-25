// Shared types + pure portfolio math for the Investing tab. No DB or network
// access here except fetchQuotes(), so the allocation logic stays easy to test.

export type InvestAccount = 'brokerage' | 'roth_ira' | 'crypto';
export type AssetClass = 'us_stock' | 'intl_stock' | 'bond' | 'reit' | 'crypto' | 'cash' | 'other';

export const ACCOUNT_LABELS: Record<InvestAccount, string> = {
  brokerage: 'Brokerage',
  roth_ira: 'Roth IRA',
  crypto: 'Crypto',
};

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  us_stock: 'US stocks',
  intl_stock: 'International stocks',
  bond: 'Bonds',
  reit: 'Real estate (REITs)',
  crypto: 'Crypto',
  cash: 'Cash',
  other: 'Other',
};

// IRS Roth IRA contribution limit for 2026 (under age 50). Update each year.
export const ROTH_IRA_ANNUAL_LIMIT = 7500;

export type Holding = {
  id: number;
  account: InvestAccount;
  symbol: string;
  name: string | null;
  asset_class: AssetClass;
  quantity: string;
  cost_basis: string | null;
  manual_price: string | null;
  created_at: string;
};

export type IpoWatchItem = {
  id: number;
  company: string;
  sector: string | null;
  expected_timing: string | null;
  est_valuation: string | null;
  status: 'rumored' | 'filed' | 'priced' | 'public' | 'passed';
  notes: string | null;
  created_at: string;
};

export type InvestingProfile = {
  id: number;
  risk_tolerance: string;
  horizon_years: number;
  monthly_brokerage: string;
  monthly_roth: string;
  monthly_crypto: string;
  target_us_stock: number;
  target_intl_stock: number;
  target_bond: number;
  target_reit: number;
  target_crypto: number;
  target_cash: number;
  notes: string | null;
};

export type BriefKind = 'market' | 'ipo' | 'portfolio' | 'ask';

export type BriefSource = { url: string; title: string };

export type InvestingBrief = {
  id: number;
  kind: BriefKind;
  question: string | null;
  content: string;
  sources: BriefSource[];
  created_at: string;
};

export type Quote = { price: number; changePct: number | null };

export type PricedHolding = Holding & {
  price: number | null;
  priceSource: 'live' | 'manual' | 'none';
  changePct: number | null;
  value: number;
  gain: number | null;
};

export function targetsFromProfile(p: InvestingProfile): Record<AssetClass, number> {
  return {
    us_stock: p.target_us_stock,
    intl_stock: p.target_intl_stock,
    bond: p.target_bond,
    reit: p.target_reit,
    crypto: p.target_crypto,
    cash: p.target_cash,
    other: 0,
  };
}

/** Yahoo Finance ticker for a holding — crypto like BTC becomes BTC-USD. */
function quoteTicker(h: Holding): string | null {
  const sym = h.symbol.trim().toUpperCase();
  if (h.asset_class === 'cash' || sym === 'CASH') return null;
  if (h.account === 'crypto' || h.asset_class === 'crypto') {
    return sym.includes('-') ? sym : `${sym}-USD`;
  }
  return sym;
}

/**
 * Live quotes from Yahoo Finance's public chart endpoint (no API key). It is
 * unofficial, so every failure is swallowed and the holding falls back to its
 * manual price instead of breaking the page. Cached for 5 minutes.
 */
export async function fetchQuotes(holdings: Holding[]): Promise<Map<string, Quote>> {
  const tickers = Array.from(new Set(holdings.map(quoteTicker).filter((t): t is string => !!t)));
  const quotes = new Map<string, Quote>();

  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`,
          { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 300 } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        const price = Number(meta?.regularMarketPrice);
        const prev = Number(meta?.chartPreviousClose ?? meta?.previousClose);
        if (!Number.isFinite(price) || price <= 0) return;
        quotes.set(ticker, {
          price,
          changePct: Number.isFinite(prev) && prev > 0 ? ((price - prev) / prev) * 100 : null,
        });
      } catch {
        // network/parse failure — fall back to manual price
      }
    })
  );

  return quotes;
}

export function priceHoldings(holdings: Holding[], quotes: Map<string, Quote>): PricedHolding[] {
  return holdings.map((h) => {
    const qty = Number(h.quantity);
    const ticker = quoteTicker(h);
    const live = ticker ? quotes.get(ticker) : undefined;
    let price: number | null = null;
    let priceSource: PricedHolding['priceSource'] = 'none';

    if (ticker === null) {
      price = 1; // cash: quantity is the dollar amount
      priceSource = 'manual';
    } else if (live) {
      price = live.price;
      priceSource = 'live';
    } else if (h.manual_price !== null) {
      price = Number(h.manual_price);
      priceSource = 'manual';
    }

    const value = price !== null ? price * qty : h.cost_basis !== null ? Number(h.cost_basis) : 0;
    const gain = price !== null && h.cost_basis !== null ? value - Number(h.cost_basis) : null;

    return { ...h, price, priceSource, changePct: live?.changePct ?? null, value, gain };
  });
}

export type AllocationRow = {
  assetClass: AssetClass;
  value: number;
  currentPct: number;
  targetPct: number;
  /** Dollars to add (+) or trim (−) to hit target at today's total. */
  gapDollars: number;
  /** Suggested share of next month's contributions. */
  nextContribution: number;
};

/**
 * Compares current allocation to target and splits next month's new money
 * toward the most-underweight classes first ("rebalance with contributions"),
 * which avoids selling — and the taxable gains that selling triggers in the
 * brokerage account.
 */
export function computeAllocation(
  priced: PricedHolding[],
  targets: Record<AssetClass, number>,
  monthlyContribution: number
): { total: number; rows: AllocationRow[] } {
  const total = priced.reduce((s, h) => s + h.value, 0);
  const classes = Object.keys(ASSET_CLASS_LABELS) as AssetClass[];
  const byClass = new Map<AssetClass, number>();
  for (const h of priced) byClass.set(h.asset_class, (byClass.get(h.asset_class) ?? 0) + h.value);

  const futureTotal = total + monthlyContribution;
  const shortfalls = classes.map((c) => Math.max(0, (targets[c] / 100) * futureTotal - (byClass.get(c) ?? 0)));
  const shortfallSum = shortfalls.reduce((a, b) => a + b, 0);

  const rows = classes
    .map((c, i) => {
      const value = byClass.get(c) ?? 0;
      const targetPct = targets[c];
      return {
        assetClass: c,
        value,
        currentPct: total > 0 ? (value / total) * 100 : 0,
        targetPct,
        gapDollars: (targetPct / 100) * total - value,
        nextContribution:
          shortfallSum > 0
            ? (shortfalls[i] / shortfallSum) * monthlyContribution
            : (targetPct / 100) * monthlyContribution,
      };
    })
    .filter((r) => r.value > 0 || r.targetPct > 0);

  return { total, rows };
}

export function formatMoney(n: number, opts: { cents?: boolean } = {}): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  });
}

export function formatPct(n: number, digits = 1): string {
  return `${n >= 0 ? '' : '−'}${Math.abs(n).toFixed(digits)}%`;
}

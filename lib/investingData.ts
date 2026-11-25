import { sql } from '@/lib/db';
import {
  computeAllocation,
  fetchQuotes,
  priceHoldings,
  targetsFromProfile,
  type Holding,
  type InvestingBrief,
  type InvestingProfile,
  type IpoWatchItem,
} from '@/lib/investing';

/** Everything the Investing page and the AI analyst need, priced and allocated. */
export async function loadInvestingData() {
  const [holdings, watchlist, profileRows, briefs] = (await Promise.all([
    sql`select * from investment_holdings order by account, created_at asc`,
    sql`select * from ipo_watchlist order by (status = 'passed') asc, created_at desc`,
    sql`select * from investing_profile where id = 1`,
    sql`select * from investing_briefs order by created_at desc limit 30`,
  ])) as [Holding[], IpoWatchItem[], InvestingProfile[], InvestingBrief[]];

  const profile = profileRows[0];
  const quotes = await fetchQuotes(holdings);
  const priced = priceHoldings(holdings, quotes);
  const monthly =
    Number(profile.monthly_brokerage) + Number(profile.monthly_roth) + Number(profile.monthly_crypto);
  const { total, rows } = computeAllocation(priced, targetsFromProfile(profile), monthly);

  return { profile, priced, watchlist, briefs, total, allocation: rows, monthly };
}

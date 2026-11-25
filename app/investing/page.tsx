import { loadInvestingData } from '@/lib/investingData';
import { isBotConfigured } from '@/lib/investingBot';
import InvestingSummary from '@/components/InvestingSummary';
import AnalystPanel from '@/components/AnalystPanel';
import AllocationCard from '@/components/AllocationCard';
import HoldingsTable from '@/components/HoldingsTable';
import InvestingProfileCard from '@/components/InvestingProfileCard';
import IpoWatchlist from '@/components/IpoWatchlist';

export const dynamic = 'force-dynamic';
// The AI analyst runs web searches inside a server action on this page, which
// can take a couple of minutes.
export const maxDuration = 300;

export default async function InvestingPage() {
  const { profile, priced, watchlist, briefs, total, allocation, monthly } = await loadInvestingData();

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Investing</h1>
        <p>Brokerage, Roth IRA, and crypto in one place — with an analyst that reads the market and the IPO pipeline.</p>
      </div>

      <InvestingSummary priced={priced} total={total} monthlyRoth={Number(profile.monthly_roth)} />
      <AnalystPanel briefs={briefs} configured={isBotConfigured()} />
      <AllocationCard rows={allocation} total={total} monthly={monthly} />
      <HoldingsTable priced={priced} />
      <IpoWatchlist items={watchlist} />
      <InvestingProfileCard profile={profile} />
    </div>
  );
}

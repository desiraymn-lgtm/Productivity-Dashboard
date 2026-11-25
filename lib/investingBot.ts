import Anthropic from '@anthropic-ai/sdk';
import {
  ACCOUNT_LABELS,
  ASSET_CLASS_LABELS,
  ROTH_IRA_ANNUAL_LIMIT,
  formatMoney,
  type AllocationRow,
  type BriefKind,
  type BriefSource,
  type InvestingProfile,
  type IpoWatchItem,
  type PricedHolding,
} from '@/lib/investing';
import { currentDateKey } from '@/lib/dates';

const MODEL = 'claude-opus-5-5';

// Frozen so it caches across requests; everything that changes per request
// (date, holdings, the question) goes in the user message instead.
const SYSTEM_PROMPT = `You are the investing analyst inside a personal finance dashboard. You work for one person: a long-horizon individual investor who holds a taxable brokerage account, a Roth IRA, and a crypto account. You are given their current holdings, target allocation, monthly contributions, and IPO watchlist.

How to work:
- Use web search for anything time-sensitive: prices, index levels, rates, Fed decisions, earnings, IPO filings, IPO dates and pricing, crypto market moves. Do not answer current-events questions from memory.
- Put a date on every market fact ("as of Nov 24"). Separate what is confirmed (an S-1 / F-1 filing, a priced deal, an official statement) from what is reported or rumored, and say which.
- Never invent tickers, dates, valuations, or figures. If you can't verify something, say so.
- Be specific and decisive. Give concrete actions with tickers, dollar amounts, and which account they belong in, and give the reasoning in a sentence. Prefer low-cost diversified funds as the core and keep speculative positions (single stocks, IPOs, crypto) sized small.
- Account placement matters: Roth IRA for the highest expected long-term growth (gains are never taxed), taxable brokerage for tax-efficient broad index funds (and tax-loss harvesting where it applies), crypto sized as a capped slice of the whole portfolio.
- For IPOs: individual investors usually can't buy at the offer price. Say how they could realistically get exposure (brokerage IPO-access programs, buying after listing, or not at all), and note that newly public stocks are often volatile and many trade below their first-day price within a year.
- End with one short line noting that this is research to inform their own decisions, not personalized advice from a licensed advisor. Say it once and don't hedge elsewhere.

Formatting (the dashboard renders only these): "## " section headings, "- " bullets, Markdown pipe tables, and **bold**. No other headings, no links in the text, no emoji. Keep it scannable, under about 900 words.`;

const TASKS: Record<Exclude<BriefKind, 'ask'>, string> = {
  market: `Write today's market reading. Cover: the major US indices and how they've moved this week, interest rates and the Fed (the latest decision and what's priced in next), inflation and jobs data released recently, sector leadership, bitcoin and ether, and the 2–4 events in the next two weeks that matter most. Finish with "## What this means for you": 3–5 bullets tying the conditions to this specific portfolio (e.g. whether to keep dollar-cost averaging as planned, anything in their holdings exposed to the news).`,
  ipo: `Build the IPO pipeline report: private companies that are expected to go public soon. Search for recent S-1/F-1 filings, IPOs scheduled or priced in the next 1–3 months, and well-sourced reports of large private companies preparing to list (in 2026–2027). Present a table with: Company, Sector, Status (filed / expected / reported), Expected timing, Last known valuation, and Exchange/ticker if known. Then, for the 3–5 most notable, give a short take: what the business does, why it's interesting, the main risks, and whether it fits this portfolio (and in which account, if any). Flag any companies already on their watchlist with updates. Close with how they could realistically get access.`,
  portfolio: `Review this portfolio and tell them what to invest in. Cover: "## Snapshot" (total, allocation vs target, concentration risks, overlap between funds), "## What to buy next" (a concrete plan for next month's contributions, per account, with tickers and dollar amounts — use the suggested contribution split as a starting point but adjust with judgment), "## Holdings to reconsider" (expensive funds, overlap, positions outside their target, tax-placement improvements), and "## Long-term plan" (whether the target allocation fits their horizon and risk tolerance, and Roth IRA max-out pacing). Search for current expense ratios or news on their specific holdings where useful.`,
};

function buildContext(input: BotContext): string {
  const { profile, holdings, allocation, total, watchlist } = input;
  const lines: string[] = [];
  lines.push(`Today's date: ${currentDateKey()}`);
  lines.push('');
  lines.push('## Investor profile');
  lines.push(`- Risk tolerance: ${profile.risk_tolerance}`);
  lines.push(`- Time horizon: ${profile.horizon_years} years`);
  lines.push(
    `- Monthly contributions: Brokerage ${formatMoney(Number(profile.monthly_brokerage))}, Roth IRA ${formatMoney(
      Number(profile.monthly_roth)
    )}, Crypto ${formatMoney(Number(profile.monthly_crypto))}`
  );
  lines.push(`- Roth IRA annual limit this year: ${formatMoney(ROTH_IRA_ANNUAL_LIMIT)}`);
  if (profile.notes) lines.push(`- Notes from the investor: ${profile.notes}`);
  lines.push('');
  lines.push(`## Holdings (total ${formatMoney(total)})`);
  if (holdings.length === 0) {
    lines.push('No holdings entered yet.');
  } else {
    lines.push('| Account | Symbol | Name | Class | Quantity | Price | Value | Cost basis |');
    lines.push('|---|---|---|---|---|---|---|---|');
    for (const h of holdings) {
      lines.push(
        `| ${ACCOUNT_LABELS[h.account]} | ${h.symbol} | ${h.name ?? ''} | ${ASSET_CLASS_LABELS[h.asset_class]} | ${Number(
          h.quantity
        )} | ${h.price !== null ? formatMoney(h.price, { cents: true }) : 'unknown'} | ${formatMoney(h.value)} | ${
          h.cost_basis !== null ? formatMoney(Number(h.cost_basis)) : 'unknown'
        } |`
      );
    }
  }
  lines.push('');
  lines.push('## Allocation vs target');
  lines.push('| Asset class | Current | Target | Suggested share of next month’s contributions |');
  lines.push('|---|---|---|---|');
  for (const r of allocation) {
    lines.push(
      `| ${ASSET_CLASS_LABELS[r.assetClass]} | ${r.currentPct.toFixed(1)}% | ${r.targetPct}% | ${formatMoney(
        r.nextContribution
      )} |`
    );
  }
  lines.push('');
  lines.push('## IPO watchlist');
  if (watchlist.length === 0) lines.push('Empty.');
  for (const w of watchlist) {
    lines.push(
      `- ${w.company} (${w.status}${w.sector ? `, ${w.sector}` : ''}${w.expected_timing ? `, expected ${w.expected_timing}` : ''})${
        w.notes ? ` — ${w.notes}` : ''
      }`
    );
  }
  return lines.join('\n');
}

export type BotContext = {
  profile: InvestingProfile;
  holdings: PricedHolding[];
  allocation: AllocationRow[];
  total: number;
  watchlist: IpoWatchItem[];
};

export type BotResult = { content: string; sources: BriefSource[] };

export function isBotConfigured(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

export async function runInvestingBot(kind: BriefKind, ctx: BotContext, question?: string): Promise<BotResult> {
  const client = new Anthropic();
  const task = kind === 'ask' ? `Answer this question from the investor:\n\n${question}` : TASKS[kind];

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: 'user', content: `${buildContext(ctx)}\n\n---\n\n${task}` },
  ];

  let response: Anthropic.Beta.BetaMessage | null = null;
  const textParts: string[] = [];
  const sources = new Map<string, BriefSource>();

  // Web search runs server-side; a long research turn may come back as
  // pause_turn, in which case we send the partial turn back to let it continue.
  for (let attempt = 0; attempt < 4; attempt++) {
    response = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 32000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium' },
        cache_control: { type: 'ephemeral' },
        system: SYSTEM_PROMPT,
        tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 10 }],
        messages,
      })
      .finalMessage();

    for (const block of response.content) {
      if (block.type === 'text') {
        textParts.push(block.text);
        for (const c of block.citations ?? []) {
          if (c.type === 'web_search_result_location' && !sources.has(c.url)) {
            sources.set(c.url, { url: c.url, title: c.title ?? c.url });
          }
        }
      }
    }

    if (response.stop_reason !== 'pause_turn') break;
    messages.push({ role: 'assistant', content: response.content });
  }

  if (response?.stop_reason === 'refusal') {
    throw new Error('The analyst declined this request. Try rephrasing the question.');
  }

  const content = textParts.join('').trim();
  if (!content) throw new Error('The analyst returned an empty response. Try again in a minute.');

  return { content, sources: Array.from(sources.values()).slice(0, 25) };
}

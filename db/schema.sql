create table if not exists tasks (
  id serial primary key,
  title text not null,
  status text not null default 'open' check (status in ('open', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists habits (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists habit_logs (
  id serial primary key,
  habit_id integer not null references habits(id) on delete cascade,
  log_date date not null,
  completed boolean not null default true,
  unique (habit_id, log_date)
);

create table if not exists notes (
  id serial primary key,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_habit_logs_habit_date on habit_logs (habit_id, log_date);
create index if not exists idx_tasks_status on tasks (status);

-- ---------- Books ----------

create table if not exists books (
  id serial primary key,
  title text not null,
  author text,
  cover_url text,
  status text not null default 'want' check (status in ('want', 'reading', 'finished')),
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- 5-Year Plan (editable sections) ----------

create table if not exists plan_sections (
  id serial primary key,
  section_key text not null unique,
  title text not null,
  content text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table plan_sections add column if not exists subtitle text;

insert into plan_sections (section_key, title, content, sort_order) values
  ('vision', 'Overall Vision', '', 0),
  ('year_1', 'Year 1', '', 1),
  ('year_2', 'Year 2', '', 2),
  ('year_3', 'Year 3', '', 3),
  ('year_4', 'Year 4', '', 4),
  ('year_5', 'Year 5', '', 5)
on conflict (section_key) do nothing;

-- Seeded from the user's Master 5-Year Plan doc. UPDATE (not INSERT) so this
-- is safe to re-run against a database that already has these rows.

update plan_sections set subtitle = 'Mission & Operating System', content = $$## Mission

Build financial independence and ownership through disciplined execution — running my own life and finances the way I run a project: clear objectives, tracked KPIs, and no dollar or hour without a job.

## The Five Domains

- **Career Growth** — $80K → $100K+ (floor) / $120K+ (stretch) by 2030, through documented wins and negotiated promotions — not job-hopping.
- **Finance & Investing** — Four separated buckets: emergency fund, business acquisition fund, retirement (401k + Roth IRA), and long-term brokerage.
- **Business Acquisition** — Buy a profitable "boring business" ($300K–$700K) via SBA 7(a) + possible seller financing, closing 2028–2029.
- **TikTok Content** — Document the real journey (career, budgeting, business search, moving) across 3 starting pillars, 2–3x/week.
- **Life Infrastructure** — Protect the routine that makes everything else possible: budget, gym, and a weekly 30-minute board meeting.

## Master KPI Dashboard (track monthly)

| KPI | Target |
|---|---|
| Income | $80K → $100K+ by 2029–30 |
| Savings rate | 30%+ of take-home |
| Business Acquisition Fund | Growing every month, no withdrawals |
| Credit utilization | Under 10% across all cards |
| Roth IRA | On pace for annual max |
| Business listings reviewed | 5–10/month |
| TikTok posting cadence | 2–3x/week, 3 active pillars |
| Net worth | Tracked quarterly |

## The One-Line Operating Principle

Every dollar and every hour gets assigned to one of the five domains — Career, Finance, Acquisition, Content, or Life Infrastructure — and nothing sits idle without a job.$$
where section_key = 'vision';

update plan_sections set subtitle = '2026 · Foundation', content = $$**Theme:** Set up every system so the next four years compound instead of scramble.

- [ ] Move out Dec 1, within a ~$1,500/mo all-in rent budget
- [ ] Automate monthly transfers: Roth IRA (~$625), Business Acquisition Fund ($1,000–1,800), brokerage with what is left
- [ ] Confirm 401k employer match % and contribute at least enough to capture it in full
- [ ] Book a free consult with the UH SBDC (1455 West Loop South, Suite 900 · (713) 752-8400)
- [ ] Start reviewing 5–10 business listings/month on BizBuySell — track SDE, multiple, and reason for sale
- [ ] Launch TikTok with your top 3 pillars, posting 2–3x/week
- [ ] Keep gym (M–Th) and weekend routine intact — do not let new projects erode it

**Income target:** $80K$$
where section_key = 'year_1';

update plan_sections set subtitle = '2027 · Positioning', content = $$**Theme:** Build the relationships and track record that make Years 3–4 possible.

- [ ] Push for a raise/promotion toward Senior PM — target $90K+
- [ ] Document 3–5 measurable wins every 6 months, update resume/LinkedIn quarterly
- [ ] Grow the Business Acquisition Fund to $35–45K
- [ ] Build relationships with 2+ SBA lenders and a business broker
- [ ] Narrow to 1–2 target industries based on what you have learned reviewing listings
- [ ] TikTok: complete the 90-day pillar review, expand what is working

**Income target:** $90K+$$
where section_key = 'year_2';

update plan_sections set subtitle = '2028 · Acquisition Window Opens', content = $$**Theme:** The fund and the relationships are ready — start writing offers.

- [ ] Grow the Business Acquisition Fund to $75–150K
- [ ] Actively evaluate businesses and make offers
- [ ] Possible close by end of year
- [ ] Keep all 5 credit cards under 10% utilization heading into financing
- [ ] Continue career track toward $100K+$$
where section_key = 'year_3';

update plan_sections set subtitle = '2029 · Close & Stabilize', content = $$**Theme:** Own the business, keep the day job as a buffer, protect what you built.

- [ ] Close the acquisition if not already done (SBA 7(a) + possible seller note)
- [ ] Keep your W2 through closing and 3–6 months into ownership as a transition buffer
- [ ] Retain 90%+ of the acquired customer/staff base through year one

**Income target:** $100K+ combined (W2 + business)$$
where section_key = 'year_4';

update plan_sections set subtitle = '2030–31 · Operate, Scale, Reassess', content = $$**Theme:** The first four years were about building the machine — this year, run it and decide what is next.

- [ ] Stabilize and grow the acquired business
- [ ] Reassess: reinvest profits into growth, consider a second acquisition, or scale back W2 involvement
- [ ] Revisit the $120K+ stretch income target
- [ ] Run a full annual "board meeting" across all 5 domains — recalibrate the next chapter$$
where section_key = 'year_5';

-- ---------- Vision / mood / prayer board ----------

create table if not exists vision_items (
  id serial primary key,
  kind text not null default 'text' check (kind in ('text', 'image')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------- TikTok content plan ----------

create table if not exists tiktok_ideas (
  id serial primary key,
  pillar text not null,
  idea text not null,
  status text not null default 'idea' check (status in ('idea', 'planned', 'posted')),
  created_at timestamptz not null default now()
);

-- ---------- Business acquisition tracker ----------

create table if not exists business_prospects (
  id serial primary key,
  business_name text not null,
  industry text,
  stage text not null default 'researching' check (stage in ('researching', 'contacted', 'reviewing', 'passed')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists business_notes (
  id serial primary key,
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------- Budget: accounts, balance snapshots, paychecks, recurring bills ----------

drop table if exists budget_entries;

create table if not exists accounts (
  id serial primary key,
  name text not null,
  category text not null check (category in ('checking', 'savings', 'brokerage', 'retirement', 'credit_card')),
  created_at timestamptz not null default now()
);

create table if not exists account_balances (
  id serial primary key,
  account_id integer not null references accounts(id) on delete cascade,
  snapshot_date date not null,
  balance numeric(12, 2) not null default 0,
  unique (account_id, snapshot_date)
);

create table if not exists paychecks (
  id serial primary key,
  pay_date date not null,
  amount numeric(10, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists recurring_bills (
  id serial primary key,
  name text not null,
  amount numeric(10, 2) not null default 0,
  due_day integer,
  created_at timestamptz not null default now()
);

-- ---------- Rewards for hitting goals ----------

create table if not exists rewards (
  id serial primary key,
  title text not null,
  description text,
  cost numeric(10, 2),
  goal_note text,
  status text not null default 'wishlist' check (status in ('wishlist', 'earned')),
  created_at timestamptz not null default now()
);

-- ---------- Seed data ----------

insert into habits (name) values
  ('Bible reading'),
  ('Book reading'),
  ('Gym'),
  ('Vitamins')
on conflict do nothing;

insert into books (title, author, status) values
  ('Rich AF', 'Vivian Tu', 'want'),
  ('Girls That Invest', 'Simran Kaur', 'want'),
  ('The Millionaire Next Door', null, 'want'),
  ('The Four Agreements', null, 'want'),
  ('Atomic Habits', null, 'want'),
  ('As a Man Thinketh', null, 'want'),
  ('A New Way to Love Your Neighbor', 'Jada Edwards', 'want'),
  ('The Mountain Is You', null, 'want'),
  ('Ego Is the Enemy', null, 'want')
on conflict do nothing;

insert into accounts (name, category) values
  ('Chase', 'checking'),
  ('Navy Federal', 'checking'),
  ('Discover High Yielding', 'savings'),
  ('Sofi', 'savings'),
  ('Charles Schwab', 'brokerage'),
  ('Roth IRA', 'retirement'),
  ('401K', 'retirement'),
  ('Discover It', 'credit_card'),
  ('Chase Freedom Unlimited', 'credit_card'),
  ('Capital One Venture X', 'credit_card'),
  ('American Express Gold', 'credit_card')
on conflict do nothing;

insert into recurring_bills (name, amount, due_day) values
  ('Storage Bill', 169.00, 8),
  ('Gym 1', 45.00, 8),
  ('Gym 2', 32.00, null),
  ('Apple Music', 9.99, 1),
  ('Iphone Space', 2.99, 2)
on conflict do nothing;

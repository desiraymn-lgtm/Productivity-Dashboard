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

create table if not exists tiktok_vision (
  id serial primary key,
  content text not null default '',
  updated_at timestamptz not null default now()
);

insert into tiktok_vision (id, content) values (1, '') on conflict (id) do nothing;

update tiktok_vision set content = $$## Goal

Build an account documenting the real journey (career, budgeting, business search, moving) — content as a byproduct of the plan, not a competing project. Any income is upside, never a planning number.

## Starting Pillars (top 3 — expand later, not all at once)

- **Life Journey Series** ("26 & In Progress") — the throughline: budgeting, PMP, business search, moving out, real numbers and real setbacks.
- **Side Plot Saturdays** — your strongest concept; one new experience weekly (fencing, salsa, volunteering, tennis lessons, etc.) with a consistent, repeatable hook.
- **Style/Lifestyle Pillar** — whichever of your outfit/home series feels easiest to sustain (office fits or the apartment-furnishing series pairs naturally with your Dec 1 move).

Hold the rest of your pillar list (beauty, "brown coach," bag content) in reserve — add one at a time only once the first three feel sustainable, not draining.

## Content Approach

- Document, don't perform: "I'm 26, working a 9-5, trying to buy a business — here's what I'm learning" beats a polished pitch.
- Consistent recurring hook per series builds recognition — you already have good series names.
- Let the substance (PMP, business search, disciplined budget) lead — it is your realest differentiator from the broader lifestyle-account pool.

## Action Items

- [ ] Pick your top 3 pillars from your notes this week
- [ ] Post 2-3x/week to start (batch-filmed on weekends, per your schedule)
- [ ] Use the apartment move (Dec 1) as a natural content arc for the furnishing series
- [ ] Reassess after 60-90 days: which pillar is resonating, keep/cut/expand from there
- [ ] Treat all figures from any "income projection" as fantasy until you have 90 days of real data — do not budget around it

## KPIs

| Metric | Target |
|---|---|
| Posting cadence | 2-3x/week (Months 1-3) |
| Active pillars | 3 (Months 1-3), expand only after 90-day review |
| Review checkpoint | Day 90 |$$
where id = 1;

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

alter table rewards add column if not exists image_url text;

-- ---------- Goals ----------

create table if not exists goals (
  id serial primary key,
  title text not null,
  notes text,
  status text not null default 'active' check (status in ('active', 'achieved')),
  achieved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table goals add column if not exists category text;

-- ---------- Travel ----------

create table if not exists travel_spots (
  id serial primary key,
  place text not null,
  status text not null default 'want' check (status in ('want', 'been')),
  notes text,
  image_url text,
  visited_date date,
  created_at timestamptz not null default now()
);

-- ---------- Seed data ----------

insert into habits (name) values
  ('Bible reading'),
  ('Book reading'),
  ('Gym'),
  ('Vitamins')
on conflict do nothing;

insert into books (title, author, cover_url, status) values
  ('Rich AF', 'Vivian Tu', 'https://covers.openlibrary.org/b/isbn/9780593714911-L.jpg', 'want'),
  ('Girls That Invest', 'Simran Kaur', 'https://covers.openlibrary.org/b/isbn/9781119893783-L.jpg', 'want'),
  ('The Millionaire Next Door', null, 'https://covers.openlibrary.org/b/isbn/9780671015206-L.jpg', 'want'),
  ('The Four Agreements', null, 'https://covers.openlibrary.org/b/isbn/9781878424310-L.jpg', 'want'),
  ('Atomic Habits', null, 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', 'want'),
  ('As a Man Thinketh', null, 'https://covers.openlibrary.org/b/isbn/9781585426386-L.jpg', 'want'),
  ('A New Way to Love Your Neighbor', 'Jada Edwards', 'https://covers.openlibrary.org/b/isbn/9781087789187-L.jpg', 'want'),
  ('The Mountain Is You', null, 'https://covers.openlibrary.org/b/isbn/9781949759228-L.jpg', 'want'),
  ('Ego Is the Enemy', null, 'https://covers.openlibrary.org/b/isbn/9781591847816-L.jpg', 'want')
on conflict do nothing;

-- Backfill cover_url for rows already seeded on an existing database
-- (the insert above only helps on a brand-new database).
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9780593714911-L.jpg' where title = 'Rich AF' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9781119893783-L.jpg' where title = 'Girls That Invest' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9780671015206-L.jpg' where title = 'The Millionaire Next Door' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9781878424310-L.jpg' where title = 'The Four Agreements' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg' where title = 'Atomic Habits' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9781585426386-L.jpg' where title = 'As a Man Thinketh' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9781087789187-L.jpg' where title = 'A New Way to Love Your Neighbor' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9781949759228-L.jpg' where title = 'The Mountain Is You' and cover_url is null;
update books set cover_url = 'https://covers.openlibrary.org/b/isbn/9781591847816-L.jpg' where title = 'Ego Is the Enemy' and cover_url is null;

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

-- ---------- Gym (editable sections) ----------

create table if not exists gym_sections (
  id serial primary key,
  section_key text not null unique,
  title text not null,
  subtitle text,
  content text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

insert into gym_sections (section_key, title, sort_order) values
  ('overview', 'Overview & How to Use This Plan', 0),
  ('monday', 'Monday — Push', 1),
  ('tuesday', 'Tuesday — Pull', 2),
  ('wednesday', 'Wednesday — Mat Pilates', 3),
  ('thursday', 'Thursday — Legs', 4),
  ('friday', 'Friday — Light Upper Body', 5),
  ('saturday', 'Saturday — Legs', 6),
  ('sunday', 'Sunday — Tennis Match', 7),
  ('progression', '4-Week Progression At a Glance', 8)
on conflict (section_key) do nothing;

-- Seeded from the user's "4-Week Strength & Tone-Up Plan" doc. UPDATE (not
-- INSERT) so this is safe to re-run against a database that already has
-- these rows.

update gym_sections set subtitle = 'Recomposition • Pull-Up Progression • Tennis-Ready Recovery', content = $$**Starting stats:** 151.2 lb • 26.0% body fat • 111.8 lb lean mass • 5'7"

**Goal:** 140 lb with muscle maintained/gained • Strict pull-up • Visible tone

## Weekly Schedule

| Day | Focus |
|---|---|
| Monday | Push (chest / shoulders / triceps) |
| Tuesday | Pull (back / biceps) — pull-up progression |
| Wednesday | Mat Pilates (core, mobility, recovery) |
| Thursday | Legs (heavy) |
| Friday | Light upper body → tennis drills (lesson) |
| Saturday | Legs (moderate) or full rest — go by feel |
| Sunday | Tennis match (long cardio day) |

## How to Use This Plan

- **"Failure"** = the last rep where your form would break down on the next one. Stop there, not after.
- Rest 60–90 sec between sets on accessory moves, 2–3 min on heavy compound lifts (squat, deadlift, bench, pull-up work).
- Weeks 1–2: focus on form and controlled reps. Weeks 3–4: push weight/intensity now that movement patterns are grooved.
- Progression rule: if you hit the TOP of the rep range for all sets with good form, add weight next session (5 lb upper body, 5–10 lb lower body) or add 1 rep if it's a bodyweight move.
- Always do 5 minutes of light cardio (bike, brisk walk) before lifting to warm up, then the mobility stretches below before your working sets.
- Static stretches (holding a stretch) go AFTER training, not before — before training, use the dynamic movements listed.$$
where section_key = 'overview';

update gym_sections set subtitle = 'Chest / Shoulders / Triceps', content = $$## Warm-Up (before lifting)

- Arm circles — 15 sec forward, 15 sec backward
- Band pull-aparts — 15 reps (activates upper back/shoulders before pressing)
- Push-up to downward dog — 8 reps, slow
- Shoulder dislocates with a band or towel — 10 reps

## Workout

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| Flat Barbell or DB Bench Press | 4 | 8–10 | Weeks 1–2: moderate weight, controlled tempo. Weeks 3–4: increase load. |
| Incline DB Press | 3 | 10–12 | 45° bench; controls upper chest — key for a lifted, toned look |
| Seated DB Shoulder Press | 3 | 8–10 | Keep core tight, don't arch lower back |
| Lateral Raises | 3 | 12–15 | Light weight, controlled — this is what builds shoulder "cap" definition |
| Cable or Machine Chest Fly | 3 | 12–15 | Squeeze at the center, slow eccentric |
| Tricep Rope Pushdown | 3 | 12–15 | Elbows pinned to your sides |
| Overhead Tricep Extension | 3 | To failure | Last exercise — go until form breaks |

## Cool-Down (after lifting)

- Doorway chest stretch — 30 sec each side
- Overhead tricep stretch — 30 sec each arm
- Cross-body shoulder stretch — 30 sec each side
- Child's pose — 45 sec (decompresses shoulders/spine)$$
where section_key = 'monday';

update gym_sections set subtitle = 'Back / Biceps + Pull-Up Progression', content = $$## Warm-Up (before lifting)

- Cat-cow — 10 reps
- Scapular pulls on the bar — 10 reps (hang, pull shoulder blades down without bending elbows)
- Band pull-aparts — 15 reps
- Light lat pulldown — 15 reps at easy weight

## Pull-Up Progression Block (do this FIRST while fresh)

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| Dead Hang | 3 | To failure (aim 20–40 sec) | Builds grip + shoulder stability — foundation for everything else |
| Band-Assisted Pull-Up | 4 | 5–8 | Use the lightest band that still lets you complete the reps with control |
| Negative Pull-Up | 3 | 5 | Jump/step to top position, lower yourself for a slow 3–5 sec count |
| Lat Pulldown (close grip) | 3 | 8–10 | Mimics the pull-up pattern — build the strength here too |

Progress: every 1–2 weeks, drop to a lighter band once reps feel controlled. By week 4, try 1 unassisted rep at the end of the block.

## Rest of Back / Biceps

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| Seated Cable Row | 3 | 10–12 | Squeeze shoulder blades together at the end |
| Single-Arm DB Row | 3 | 10–12 per side | Flat back, pull elbow toward hip |
| Face Pulls | 3 | 15 | Great for posture and shoulder health — don't skip |
| DB Bicep Curl | 3 | 10–12 | Controlled, no swinging |
| Hammer Curl | 3 | To failure | Targets forearm/grip — helps pull-up strength too |

## Cool-Down (after lifting)

- Lat stretch (reach overhead and lean side to side) — 30 sec each side
- Bicep wall stretch — 30 sec each arm
- Cat-cow — 8 slow reps
- Child's pose reaching forward — 45 sec$$
where section_key = 'tuesday';

update gym_sections set subtitle = 'Recovery Day', content = $$Use your gym's free mat Pilates class. This is active recovery between heavy legs and your Friday tennis lesson — it builds the core stability that directly supports pull-ups, squats, and tennis rotation, without adding fatigue.

If no class is running, self-guided 20-minute mat circuit:

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| Pilates Hundred | 1 | 100 pulses (10 sets of 10) | Core activation — keep lower back pressed to mat |
| Roll-Up | 3 | 8 | Slow and controlled, no momentum |
| Single-Leg Stretch | 3 | 10 per side | Keep shoulders off the mat, core engaged |
| Plank | 3 | 30–45 sec hold | Straight line from shoulders to heels |
| Side Plank | 2 | 20–30 sec per side | Builds obliques — supports tennis rotation |
| Bird Dog | 3 | 8 per side | Slow, controlled, minimal hip sway |

## Full-Body Mobility (do after Pilates)

- Cat-cow — 10 reps
- Seated spinal twist — 30 sec each side
- Hip flexor lunge stretch — 30 sec each side
- Child's pose — 60 sec$$
where section_key = 'wednesday';

update gym_sections set subtitle = 'Heavy', content = $$## Warm-Up (before lifting)

- Bodyweight squats — 15 reps
- Walking lunges — 10 per leg
- Leg swings (front-back and side-side) — 10 each direction, each leg
- Glute bridges — 15 reps

## Workout

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| Barbell or Goblet Squat | 4 | 8–10 | Weeks 1–2 build form; weeks 3–4 add weight — this is your main strength driver |
| Romanian Deadlift | 4 | 8–10 | Hinge at hips, slight knee bend, feel it in hamstrings/glutes |
| Walking Lunges | 3 | 10–12 per leg | Hold dumbbells for added load once bodyweight feels easy |
| Hip Thrust | 3 | 10–12 | Full glute squeeze at the top — key exercise for the "tone" you want |
| Leg Press or Bulgarian Split Squat | 3 | 10–12 | Split squat is harder — great once regular lunges feel easy |
| Standing Calf Raise | 3 | 15–20 | Slow and controlled, full range |

## Cool-Down (after lifting)

- Standing quad stretch — 30 sec each leg
- Seated hamstring stretch — 30 sec each leg
- Figure-4 glute stretch — 30 sec each side
- Deep squat hold (couch stretch alternative) — 45 sec
- Calf stretch against wall — 30 sec each leg$$
where section_key = 'thursday';

update gym_sections set subtitle = '+ Tennis Drills', content = $$Since your lesson is drills (not full-intensity match play), light upper volume in the morning won't compromise it — just keep this session lighter than Monday's push day.

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| DB Shoulder Press | 2 | 10–12 | Lighter weight than Monday |
| Seated Cable Row | 2 | 10–12 | Light-moderate weight |
| Lateral Raises | 2 | 12–15 | Light weight |
| Bicep Curl / Tricep Pushdown Superset | 2 rounds | 12 each | Keep this brief — save energy for drills |

## Pre-Tennis Dynamic Warm-Up (before drills)

- Arm circles — 20 sec each direction
- Walking lunges with a twist — 8 per leg
- High knees — 20 sec
- Lateral shuffles — 20 sec each direction
- Shoulder pass-throughs with a band or towel — 10 reps

## Post-Tennis Cool-Down

- Standing quad stretch — 30 sec each leg
- Shoulder cross-body stretch — 30 sec each arm
- Calf stretch — 30 sec each leg
- Seated forward fold — 45 sec$$
where section_key = 'friday';

update gym_sections set subtitle = 'Moderate, or Rest', content = $$This is your flex day. If you're recovered and not sore, do the moderate session below. If you're feeling beat up from the week, take a full rest day instead — recovery is what lets Sunday's match and next week's lifts actually progress.

| Exercise | Sets | Reps / Target | Notes |
|---|---|---|---|
| Goblet Squat | 3 | 12–15 | Lighter than Wednesday — moderate weight, higher reps |
| Glute Bridge | 3 | 15 | Full squeeze at top |
| Step-Ups | 3 | 10 per leg | Use a bench or box |
| Standing Calf Raise | 2 | 15–20 | Optional — skip if legs are fatigued |

## Mobility (do this daily if possible)

- 90/90 hip stretch — 30 sec each side
- Couch stretch — 30 sec each leg
- Standing forward fold — 45 sec
- Foam roll quads, hamstrings, calves — 1 min each area if available$$
where section_key = 'saturday';

update gym_sections set subtitle = 'Long Cardio Day', content = $$This is your long cardio day. No additional lifting needed — treat match play as your conditioning work for the week.

## Pre-Match Dynamic Warm-Up

- Jog or brisk walk — 5 min
- Leg swings (front-back, side-side) — 10 each, each leg
- Arm circles + shoulder pass-throughs — 20 reps
- Lateral shuffles and quick feet — 30 sec

## Post-Match Cool-Down (important — full week of training behind you)

- Standing quad stretch — 30 sec each leg
- Hamstring stretch — 30 sec each leg
- Hip flexor stretch — 30 sec each side
- Shoulder and forearm stretch — 30 sec each arm (racquet arm especially)
- 5–10 min easy walk to bring heart rate down$$
where section_key = 'sunday';

update gym_sections set content = $$| Week | Lifting Focus | Pull-Up Focus |
|---|---|---|
| 1 | Learn form, moderate weight, stop 1–2 reps shy of failure on compound lifts | Dead hangs + heavy band assist — focus on control |
| 2 | Same weight, push closer to true failure on last set of each move | Slightly lighter band, add negatives |
| 3 | Increase weight on compound lifts (squat, bench, RDL, row) | Lighter band still, negatives slower (5 sec) |
| 4 | Heaviest week — push all working sets to true failure on final set | Attempt 1 unassisted rep at the end of the block |$$
where section_key = 'progression';

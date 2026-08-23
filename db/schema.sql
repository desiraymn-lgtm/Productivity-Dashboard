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

insert into plan_sections (section_key, title, content, sort_order) values
  ('vision', 'Overall Vision', '', 0),
  ('year_1', 'Year 1', '', 1),
  ('year_2', 'Year 2', '', 2),
  ('year_3', 'Year 3', '', 3),
  ('year_4', 'Year 4', '', 4),
  ('year_5', 'Year 5', '', 5)
on conflict (section_key) do nothing;

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

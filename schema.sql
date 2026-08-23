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

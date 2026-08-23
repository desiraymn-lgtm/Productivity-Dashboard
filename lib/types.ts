export type TaskStatus = 'open' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
};

export type Habit = {
  id: number;
  name: string;
  created_at: string;
};

export type HabitWithStreak = Habit & {
  streak: number;
  doneToday: boolean;
};

export type HabitLog = {
  habit_id: number;
  log_date: string;
};

export type Note = {
  id: number;
  content: string;
  created_at: string;
};

export type BookStatus = 'want' | 'reading' | 'finished';

export type Book = {
  id: number;
  title: string;
  author: string | null;
  cover_url: string | null;
  status: BookStatus;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
};

export type PlanSection = {
  id: number;
  section_key: string;
  title: string;
  subtitle: string | null;
  content: string;
  sort_order: number;
  updated_at: string;
};

export type VisionKind = 'text' | 'image';

export type VisionItem = {
  id: number;
  kind: VisionKind;
  content: string;
  created_at: string;
};

export type TiktokStatus = 'idea' | 'planned' | 'posted';

export type TiktokIdea = {
  id: number;
  pillar: string;
  idea: string;
  status: TiktokStatus;
  created_at: string;
};

export type ProspectStage = 'researching' | 'contacted' | 'reviewing' | 'passed';

export type BusinessProspect = {
  id: number;
  business_name: string;
  industry: string | null;
  stage: ProspectStage;
  notes: string | null;
  created_at: string;
};

export type BusinessNote = {
  id: number;
  content: string;
  created_at: string;
};

export type BudgetEntry = {
  id: number;
  pay_date: string;
  income: string;
  bills: string;
  savings: string;
  spending: string;
  notes: string | null;
  created_at: string;
};

export type AccountCategory = 'checking' | 'savings' | 'brokerage' | 'retirement' | 'credit_card';

export type Account = {
  id: number;
  name: string;
  category: AccountCategory;
  created_at: string;
};

export type AccountBalance = {
  id: number;
  account_id: number;
  snapshot_date: string;
  balance: string;
};

export type Paycheck = {
  id: number;
  pay_date: string;
  amount: string;
  notes: string | null;
  created_at: string;
};

export type RecurringBill = {
  id: number;
  name: string;
  amount: string;
  due_day: number | null;
  created_at: string;
};

export type RewardStatus = 'wishlist' | 'earned';

export type Reward = {
  id: number;
  title: string;
  description: string | null;
  cost: string | null;
  goal_note: string | null;
  status: RewardStatus;
  created_at: string;
};

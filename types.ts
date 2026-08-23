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

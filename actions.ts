'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';

// ---------- Tasks ----------

export async function addTask(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  const priority = String(formData.get('priority') || 'medium');
  const dueDateRaw = String(formData.get('dueDate') || '').trim();
  const dueDate = dueDateRaw.length > 0 ? dueDateRaw : null;

  if (!title) return;

  await sql`
    insert into tasks (title, priority, due_date)
    values (${title}, ${priority}, ${dueDate})
  `;

  revalidatePath('/');
}

export async function toggleTask(id: number, currentStatus: string) {
  const next = currentStatus === 'done' ? 'open' : 'done';
  await sql`update tasks set status = ${next} where id = ${id}`;
  revalidatePath('/');
}

export async function deleteTask(id: number) {
  await sql`delete from tasks where id = ${id}`;
  revalidatePath('/');
}

// ---------- Habits ----------

export async function addHabit(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) return;

  await sql`insert into habits (name) values (${name})`;
  revalidatePath('/');
}

export async function toggleHabitToday(habitId: number, isDoneToday: boolean) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  if (isDoneToday) {
    await sql`delete from habit_logs where habit_id = ${habitId} and log_date = ${todayStr}`;
  } else {
    await sql`
      insert into habit_logs (habit_id, log_date)
      values (${habitId}, ${todayStr})
      on conflict (habit_id, log_date) do nothing
    `;
  }

  revalidatePath('/');
}

export async function deleteHabit(id: number) {
  await sql`delete from habits where id = ${id}`;
  revalidatePath('/');
}

// ---------- Notes ----------

export async function addNote(formData: FormData) {
  const content = String(formData.get('content') || '').trim();
  if (!content) return;

  await sql`insert into notes (content) values (${content})`;
  revalidatePath('/');
}

export async function deleteNote(id: number) {
  await sql`delete from notes where id = ${id}`;
  revalidatePath('/');
}

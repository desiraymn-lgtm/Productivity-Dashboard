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

// ---------- Books ----------

export async function addBook(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  if (!title) return;
  const author = optional(formData, 'author');
  const coverUrl = optional(formData, 'coverUrl');
  const status = String(formData.get('status') || 'want');
  const startDate = optional(formData, 'startDate');
  const endDate = optional(formData, 'endDate');
  const notes = optional(formData, 'notes');

  await sql`
    insert into books (title, author, cover_url, status, start_date, end_date, notes)
    values (${title}, ${author}, ${coverUrl}, ${status}, ${startDate}, ${endDate}, ${notes})
  `;
  revalidatePath('/books');
}

export async function updateBookStatus(id: number, status: string) {
  const today = todayStr();
  if (status === 'reading') {
    await sql`update books set status = 'reading', start_date = coalesce(start_date, ${today}) where id = ${id}`;
  } else if (status === 'finished') {
    await sql`update books set status = 'finished', end_date = coalesce(end_date, ${today}) where id = ${id}`;
  } else {
    await sql`update books set status = ${status} where id = ${id}`;
  }
  revalidatePath('/books');
}

export async function deleteBook(id: number) {
  await sql`delete from books where id = ${id}`;
  revalidatePath('/books');
}

// ---------- 5-Year Plan ----------

export async function updatePlanSection(sectionKey: string, formData: FormData) {
  const content = String(formData.get('content') || '');
  await sql`
    update plan_sections set content = ${content}, updated_at = now()
    where section_key = ${sectionKey}
  `;
  revalidatePath('/five-year-plan');
}

// ---------- Vision board ----------

export async function addVisionItem(formData: FormData) {
  const kind = String(formData.get('kind') || 'text');
  const content = String(formData.get('content') || '').trim();
  if (!content) return;

  await sql`insert into vision_items (kind, content) values (${kind}, ${content})`;
  revalidatePath('/vision-board');
}

export async function deleteVisionItem(id: number) {
  await sql`delete from vision_items where id = ${id}`;
  revalidatePath('/vision-board');
}

// ---------- TikTok plan ----------

export async function addTiktokIdea(formData: FormData) {
  const pillar = String(formData.get('pillar') || '').trim();
  const idea = String(formData.get('idea') || '').trim();
  if (!pillar || !idea) return;

  await sql`insert into tiktok_ideas (pillar, idea) values (${pillar}, ${idea})`;
  revalidatePath('/tiktok');
}

export async function cycleTiktokStatus(id: number, currentStatus: string) {
  const order = ['idea', 'planned', 'posted'];
  const next = order[(order.indexOf(currentStatus) + 1) % order.length];
  await sql`update tiktok_ideas set status = ${next} where id = ${id}`;
  revalidatePath('/tiktok');
}

export async function deleteTiktokIdea(id: number) {
  await sql`delete from tiktok_ideas where id = ${id}`;
  revalidatePath('/tiktok');
}

// ---------- Business tracker ----------

export async function addProspect(formData: FormData) {
  const businessName = String(formData.get('businessName') || '').trim();
  if (!businessName) return;
  const industry = optional(formData, 'industry');
  const stage = String(formData.get('stage') || 'researching');
  const notes = optional(formData, 'notes');

  await sql`
    insert into business_prospects (business_name, industry, stage, notes)
    values (${businessName}, ${industry}, ${stage}, ${notes})
  `;
  revalidatePath('/business');
}

export async function updateProspectStage(id: number, stage: string) {
  await sql`update business_prospects set stage = ${stage} where id = ${id}`;
  revalidatePath('/business');
}

export async function deleteProspect(id: number) {
  await sql`delete from business_prospects where id = ${id}`;
  revalidatePath('/business');
}

export async function addBusinessNote(formData: FormData) {
  const content = String(formData.get('content') || '').trim();
  if (!content) return;
  await sql`insert into business_notes (content) values (${content})`;
  revalidatePath('/business');
}

export async function deleteBusinessNote(id: number) {
  await sql`delete from business_notes where id = ${id}`;
  revalidatePath('/business');
}

// ---------- Budget: accounts ----------

export async function addAccount(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const category = String(formData.get('category') || 'checking');
  if (!name) return;

  await sql`insert into accounts (name, category) values (${name}, ${category})`;
  revalidatePath('/budget');
}

export async function deleteAccount(id: number) {
  await sql`delete from accounts where id = ${id}`;
  revalidatePath('/budget');
}

// ---------- Budget: snapshots ----------

export async function saveSnapshot(formData: FormData) {
  const snapshotDate = String(formData.get('snapshotDate') || '').trim();
  if (!snapshotDate) return;

  const entries: { accountId: number; balance: number }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('balance_')) continue;
    const accountId = Number(key.replace('balance_', ''));
    const balance = Number(value);
    if (Number.isFinite(accountId) && Number.isFinite(balance)) {
      entries.push({ accountId, balance });
    }
  }

  for (const entry of entries) {
    await sql`
      insert into account_balances (account_id, snapshot_date, balance)
      values (${entry.accountId}, ${snapshotDate}, ${entry.balance})
      on conflict (account_id, snapshot_date) do update set balance = excluded.balance
    `;
  }

  revalidatePath('/budget');
}

export async function deleteSnapshot(snapshotDate: string) {
  await sql`delete from account_balances where snapshot_date = ${snapshotDate}`;
  revalidatePath('/budget');
}

// ---------- Budget: paychecks ----------

export async function addPaycheck(formData: FormData) {
  const payDate = String(formData.get('payDate') || '').trim();
  if (!payDate) return;
  const amount = numeric(formData, 'amount');
  const notes = optional(formData, 'notes');

  await sql`insert into paychecks (pay_date, amount, notes) values (${payDate}, ${amount}, ${notes})`;
  revalidatePath('/budget');
}

export async function deletePaycheck(id: number) {
  await sql`delete from paychecks where id = ${id}`;
  revalidatePath('/budget');
}

// ---------- Budget: recurring bills ----------

export async function addRecurringBill(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) return;
  const amount = numeric(formData, 'amount');
  const dueDayRaw = String(formData.get('dueDay') || '').trim();
  const dueDay = dueDayRaw.length > 0 ? Number(dueDayRaw) : null;

  await sql`insert into recurring_bills (name, amount, due_day) values (${name}, ${amount}, ${dueDay})`;
  revalidatePath('/budget');
}

export async function deleteRecurringBill(id: number) {
  await sql`delete from recurring_bills where id = ${id}`;
  revalidatePath('/budget');
}

// ---------- Rewards ----------

export async function addReward(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  if (!title) return;
  const description = optional(formData, 'description');
  const cost = formData.get('cost') ? numeric(formData, 'cost') : null;
  const goalNote = optional(formData, 'goalNote');

  await sql`
    insert into rewards (title, description, cost, goal_note)
    values (${title}, ${description}, ${cost}, ${goalNote})
  `;
  revalidatePath('/rewards');
}

export async function toggleRewardStatus(id: number, currentStatus: string) {
  const next = currentStatus === 'earned' ? 'wishlist' : 'earned';
  await sql`update rewards set status = ${next} where id = ${id}`;
  revalidatePath('/rewards');
}

export async function deleteReward(id: number) {
  await sql`delete from rewards where id = ${id}`;
  revalidatePath('/rewards');
}

// ---------- Shared helpers ----------

function optional(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) || '').trim();
  return value.length > 0 ? value : null;
}

function numeric(formData: FormData, key: string): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

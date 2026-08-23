'use client';

import { useRef } from 'react';
import { addTask } from '@/app/actions';

export default function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        await addTask(formData);
        formRef.current?.reset();
      }}
      className="add-form"
    >
      <input name="title" placeholder="Add a task…" aria-label="Task title" required />
      <select name="priority" defaultValue="medium" aria-label="Priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" name="dueDate" aria-label="Due date" />
      <button type="submit">Add</button>
    </form>
  );
}

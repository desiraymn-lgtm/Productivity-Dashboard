import { toggleTask, deleteTask } from '@/app/actions';
import AddTaskForm from './AddTaskForm';
import type { Task } from '@/lib/types';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const open = tasks.filter((t) => t.status === 'open');
  const done = tasks.filter((t) => t.status === 'done');

  return (
    <section className="card">
      <div className="card-head">
        <h2>Tasks</h2>
        <span className="tally">{open.length} open</span>
      </div>

      <AddTaskForm />

      {tasks.length === 0 && <p className="empty">No tasks yet. Add the first one above.</p>}

      <ul className="task-list">
        {open.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>

      {done.length > 0 && (
        <details className="done-drawer">
          <summary>{done.length} completed</summary>
          <ul className="task-list">
            {done.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function TaskRow({ task }: { task: Task }) {
  const toggleWithId = toggleTask.bind(null, task.id, task.status);
  const deleteWithId = deleteTask.bind(null, task.id);

  return (
    <li className={`task-row${task.status === 'done' ? ' is-done' : ''}`}>
      <form action={toggleWithId}>
        <button type="submit" className="checkbox" aria-label={task.status === 'done' ? 'Mark as open' : 'Mark as done'}>
          {task.status === 'done' ? '✓' : ''}
        </button>
      </form>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <span className={`task-meta priority-${task.priority}`}>
          {task.priority}
          {task.due_date ? ` · due ${formatDate(task.due_date)}` : ''}
        </span>
      </div>

      <form action={deleteWithId}>
        <button type="submit" className="row-delete" aria-label="Delete task">
          ×
        </button>
      </form>
    </li>
  );
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

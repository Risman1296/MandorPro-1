import { run } from './db-helpers';

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface TaskInput {
  projectId: string;
  title: string;
  status?: TaskStatus;
  start?: string|null;
  due?: string|null;
}

export async function insertTask(input: TaskInput) {
  const { projectId, title, status = 'TODO', start = null, due = null } = input;
  await run(
    `INSERT INTO tasks (project_id, title, status, start, due)
     VALUES (?, ?, ?, ?, ?)`,
    [projectId, title, status, start, due]
  );
}

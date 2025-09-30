import { run, all } from './db-helpers';

export type ProjectStatus = 'active' | 'paused' | 'done' | 'Pengembangan' | 'Konstruksi' | 'Selesai';

export interface ProjectInput {
  id?: string;
  name: string;
  status?: ProjectStatus;
  startDate?: string | null;
  dueDate?: string | null;
}

export async function insertProject(input: ProjectInput) {
  const { id, name, status = 'active', startDate = null, dueDate = null } = input;
  if (id) {
    await run(
      `INSERT INTO projects (id, name, status, start, due)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, status, startDate, dueDate]
    );
  } else {
    await run(
      `INSERT INTO projects (name, status, start, due)
       VALUES (?, ?, ?, ?)`,
      [name, status, startDate, dueDate]
    );
  }
}

export async function getAllProjects() {
  return all<{ id:string; name:string; status:ProjectStatus; start?:string|null; due?:string|null }>(
    `SELECT id, name, status, start, due FROM projects ORDER BY name ASC`
  );
}

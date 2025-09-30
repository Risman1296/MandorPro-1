
export async function deleteWorker(id: string) {
  return run(`DELETE FROM workers WHERE id = ?`, [id]);
}
import { run, all } from './db-helpers';

export type WorkerStatus = 'Aktif' | 'Cuti' | 'Libur' | 'Resign';
export type WorkerRole =
  | 'Tukang Bangunan' | 'Tukang Kayu' | 'Tukang Listrik' | 'Tukang Besi'
  | 'Buruh Angkut Material' | 'Buruh Bersih-bersih' | 'Buruh Umum';

export interface WorkerInput {
  name: string;
  rate: number;
  role?: WorkerRole;
  status?: WorkerStatus;
  projectId?: string | null;
}

export async function insertWorker(input: WorkerInput) {
  const { name, rate, role = null, status = 'Aktif', projectId = null } = input;
  await run(
    `INSERT INTO workers (name, rate, role, status, project_id)
     VALUES (?, ?, ?, ?, ?)`,
    [name, rate, role, status, projectId]
  );
}

export async function getAllWorkers() {
  return all<{ id:number; name:string; rate:number; role:string|null; status:WorkerStatus; project_id:string|null; project_name?:string }>(
    `SELECT w.*, p.name as project_name
     FROM workers w
     LEFT JOIN projects p ON p.id = w.project_id
     ORDER BY w.name ASC`
  );
}

import { safeGetAllAsync, safeRunAsync } from "@/src/db/adapters";

export type Worker = { id: string; name: string; role?: string; rate?: number; active: number; scope: string };

export function getAllWorkers(scope: string = "DEMO") {
  // Align to existing schema: workers table has columns (id, name, skill, daily_wage, phone, active)
  // Using scope as a logical filter is not present; we ignore scope for now and return active workers.
  return safeGetAllAsync(`SELECT id, name, skill AS role, daily_wage AS rate, active, '${scope}' AS scope FROM workers WHERE active = 1 ORDER BY name;`);
}

export async function createWorker(w: Omit<Worker, "id" | "active" | "scope"> & { scope?: string }) {
  const id = `WRK-${Math.random().toString(36).slice(2, 9)}`;
  // Map to existing schema
  await safeRunAsync(`INSERT INTO workers (id, name, skill, daily_wage, phone, active) VALUES (?,?,?,?,?,1);`, [
    id,
    w.name,
    w.role ?? null,
    w.rate ?? 0,
    null,
  ]);
  return id;
}

export function updateWorker(id: string, p: Partial<Worker>) {
  const fields: string[] = [];
  const args: any[] = [];
  for (const [k, v] of Object.entries(p)) {
    if (k === 'role') { fields.push(`skill=?`); args.push(v); }
    else if (k === 'rate') { fields.push(`daily_wage=?`); args.push(v); }
    else if (k === 'name') { fields.push(`name=?`); args.push(v); }
    else if (k === 'active') { fields.push(`active=?`); args.push(v); }
  }
  args.push(id);
  return safeRunAsync(`UPDATE workers SET ${fields.join(",")} WHERE id=?;`, args);
}

export function deleteWorker(id: string) {
  // Soft-delete to align with existing patterns
  return safeRunAsync(`UPDATE workers SET active = 0 WHERE id = ?;`, [id]);
}

import { safeGetAllAsync, safeRunAsync } from "@/src/db/adapters";

export type Project = { id: string; code?: string; name: string; status: string; scope: string };

export function getAllProjects(scope: string = "DEMO") {
  // Existing schema does not include scope/status consistently; map minimal fields
  return safeGetAllAsync(`SELECT id, code, name, COALESCE(status, 'active') AS status, '${scope}' AS scope FROM projects ORDER BY name;`);
}

export async function createProject(p: Omit<Project, "id" | "status" | "scope"> & { status?: string; scope?: string }) {
  const id = `PRJ-${Math.random().toString(36).slice(2, 9)}`;
  await safeRunAsync(`INSERT INTO projects (id, code, name, status, created_at) VALUES (?,?,?,?, datetime('now'));`, [
    id,
    p.code ?? null,
    p.name,
    p.status ?? "active",
  ]);
  return id;
}

export function deleteProject(id: string) {
  // Hard delete aligns with existing patterns for projects (no soft-delete column observed)
  return safeRunAsync(`DELETE FROM projects WHERE id = ?;`, [id]);
}

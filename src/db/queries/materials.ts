import { safeGetAllAsync } from "@/src/db/adapters";

export type MaterialStockRow = {
  id: string;
  name: string;
  unit?: string;
  total_in: number;
  total_out: number;
  balance: number;
  scope: string;
};

export async function getMaterialStock(scope: string): Promise<MaterialStockRow[]> {
  // Using existing schema (materials + stock_ledger). Scope maps to project_id in ledger.
  // On web, this falls back to mock data via safeGetAllAsync.
  const sql = `
    SELECT 
      m.id AS id,
      m.name AS name,
      m.unit AS unit,
      COALESCE(SUM(CASE WHEN sl.type = 'IN' THEN sl.qty ELSE 0 END), 0) AS total_in,
      COALESCE(SUM(CASE WHEN sl.type = 'OUT' THEN sl.qty ELSE 0 END), 0) AS total_out,
      COALESCE(SUM(CASE WHEN sl.type = 'ADJ' THEN sl.qty ELSE 0 END), 0) +
      COALESCE(SUM(CASE WHEN sl.type = 'IN' THEN sl.qty ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN sl.type = 'OUT' THEN sl.qty ELSE 0 END), 0) AS balance,
      ? AS scope
    FROM materials m
    LEFT JOIN stock_ledger sl ON m.id = sl.material_id AND sl.project_id = ?
    GROUP BY m.id
    ORDER BY m.name ASC;
  `;
  const rows = await safeGetAllAsync(sql, [scope, scope]);
  return rows as MaterialStockRow[];
}

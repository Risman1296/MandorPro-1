import { run, all } from './db-helpers';

export interface PayrollInput {
  workerId: number;
  period: string;
  amount: number;
}

export async function insertPayrollLine(input: PayrollInput) {
  const { workerId, period, amount } = input;
  await run(
    `INSERT INTO payroll_lines (worker_id, period, amount)
     VALUES (?, ?, ?)`,
    [workerId, period, amount]
  );
}

export async function getPayrollByPeriod(period: string) {
  return all<any>(
    `SELECT pl.*, w.name as worker_name
     FROM payroll_lines pl
     JOIN workers w ON w.id = pl.worker_id
     WHERE pl.period = ?
     ORDER BY w.name`,
    [period]
  );
}

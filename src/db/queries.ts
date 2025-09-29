import { safeGetAllAsync, safeGetFirstAsync, safeRunAsync, mockData } from '@/src/db/adapters';
import { getDB } from '@/src/db/index';
import { getCurrentTimestamp } from '@/src/utils/time';

// Helper functions for common database operations

// Projects
export async function getProjects() {
  try {
    return await safeGetAllAsync('SELECT * FROM projects ORDER BY created_at DESC');
  } catch (error) {
    console.warn('getProjects failed, using mock data:', error);
    return mockData.projects;
  }
}

export async function insertProject(project: any) {
  return await safeRunAsync(
    'INSERT INTO projects (id, name, code, description, start_date, end_date, status, budget, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [project.id, project.name, project.code, project.description, project.start_date, project.end_date, project.status, project.budget, project.created_at]
  );
}

export async function updateProject(project: any) {
  return await safeRunAsync(
    'UPDATE projects SET name = ?, code = ?, description = ?, start_date = ?, end_date = ?, status = ?, budget = ?, updated_at = ? WHERE id = ?',
    [project.name, project.code, project.description, project.start_date, project.end_date, project.status, project.budget, project.updated_at, project.id]
  );
}

// Workers
export async function getActiveWorkers() {
  try {
    return await safeGetAllAsync('SELECT * FROM workers WHERE active = 1 ORDER BY name');
  } catch (error) {
    console.warn('getActiveWorkers failed, using mock data:', error);
    return mockData.workers;
  }
}

export async function insertWorker(worker: any) {
  return await safeRunAsync(
    'INSERT INTO workers (id, name, skill, daily_wage, phone, nik, address, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [worker.id, worker.name, worker.skill, worker.daily_wage, worker.phone, worker.nik, worker.address, worker.active ? 1 : 0, worker.created_at]
  );
}

export async function updateWorker(worker: any) {
  return await safeRunAsync(
    'UPDATE workers SET name = ?, skill = ?, daily_wage = ?, phone = ?, nik = ?, address = ?, updated_at = ? WHERE id = ?',
    [worker.name, worker.skill, worker.daily_wage, worker.phone, worker.nik, worker.address, worker.updated_at, worker.id]
  );
}

export async function deleteWorker(workerId: string) {
  return await safeRunAsync(
    'UPDATE workers SET active = 0 WHERE id = ?',
    [workerId]
  );
}

// Tasks
export async function getTasks() {
  try {
    return await safeGetAllAsync('SELECT * FROM tasks ORDER BY created_at DESC');
  } catch (error) {
    console.warn('getTasks failed, using mock data:', error);
    return mockData.tasks || [];
  }
}

export async function insertTask(task: any) {
  return await safeRunAsync(
    'INSERT INTO tasks (id, project_id, title, description, assigned_to, status, priority, start_date, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [task.id, task.project_id, task.title, task.description, task.assigned_to, task.status, task.priority, task.start_date, task.due_date, task.created_at]
  );
}

export async function updateTask(task: any) {
  return await safeRunAsync(
    'UPDATE tasks SET title = ?, description = ?, assigned_to = ?, status = ?, priority = ?, start_date = ?, due_date = ?, updated_at = ? WHERE id = ?',
    [task.title, task.description, task.assigned_to, task.status, task.priority, task.start_date, task.due_date, task.updated_at, task.id]
  );
}

// Attendance
export async function getTodayAttendance(projectId: string, date: string) {
  try {
    return await safeGetAllAsync(
      'SELECT a.*, w.name, w.skill FROM attendance a JOIN workers w ON a.worker_id = w.id WHERE a.project_id = ? AND a.date = ?',
      [projectId, date]
    );
  } catch (error) {
    console.warn('getTodayAttendance failed:', error);
    return [];
  }
}

export async function insertAttendance(attendance: any) {
  return await safeRunAsync(
    'INSERT INTO attendance (id, worker_id, project_id, date, check_in_time, check_out_time, method, device_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [attendance.id, attendance.worker_id, attendance.project_id, attendance.date, attendance.check_in_time, attendance.check_out_time, attendance.method, attendance.device_id]
  );
}

export async function updateAttendanceCheckOut(attendanceId: string, checkOutTime: string) {
  return await safeRunAsync(
    'UPDATE attendance SET check_out_time = ? WHERE id = ?',
    [checkOutTime, attendanceId]
  );
}

// Progress
export async function getUnitProgress(unitId: string) {
  return await safeGetAllAsync(
    `SELECT up.*, wi.name as wbs_name, wi.uom, wi.qty_total, wi.weight_pct 
     FROM unit_progress up 
     JOIN wbs_items wi ON up.wbs_id = wi.id 
     WHERE up.unit_id = ? 
     ORDER BY up.date DESC`,
    [unitId]
  );
}

export async function insertUnitProgress(progress: any) {
  return await safeRunAsync(
    'INSERT INTO unit_progress (id, unit_id, wbs_id, date, qty_done, percent_done, has_qc, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [progress.id, progress.unit_id, progress.wbs_id, progress.date, progress.qty_done, progress.percent_done, progress.has_qc ? 1 : 0, progress.created_by, progress.created_at, progress.updated_at]
  );
}

// Materials
export async function getMaterialStock(projectId: string) {
  return await safeGetAllAsync(
    `SELECT 
      m.*,
      COALESCE(SUM(CASE WHEN sl.type = 'IN' THEN sl.qty ELSE 0 END), 0) as total_in,
      COALESCE(SUM(CASE WHEN sl.type = 'OUT' THEN sl.qty ELSE 0 END), 0) as total_out,
      COALESCE(SUM(CASE WHEN sl.type = 'ADJ' THEN sl.qty ELSE 0 END), 0) as total_adj,
      COALESCE(SUM(CASE WHEN sl.type = 'IN' THEN sl.qty ELSE 0 END) - 
               SUM(CASE WHEN sl.type = 'OUT' THEN sl.qty ELSE 0 END) + 
               SUM(CASE WHEN sl.type = 'ADJ' THEN sl.qty ELSE 0 END), 0) as balance
     FROM materials m
     LEFT JOIN stock_ledger sl ON m.id = sl.material_id AND sl.project_id = ?
     GROUP BY m.id
     ORDER BY m.name`,
    [projectId]
  );
}

export async function insertStockTransaction(transaction: any) {
  return await safeRunAsync(
    'INSERT INTO stock_ledger (id, project_id, material_id, date_time, type, qty, ref, note, unit_id, wbs_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [transaction.id, transaction.project_id, transaction.material_id, transaction.date_time, transaction.type, transaction.qty, transaction.ref, transaction.note, transaction.unit_id, transaction.wbs_id]
  );
}

export async function insertMaterial(material: any) {
  return await safeRunAsync(
    'INSERT INTO materials (id, name, unit, price, supplier, description, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [material.id, material.name, material.unit, material.price, material.supplier, material.description, material.category, material.created_at]
  );
}

// Payroll Management
export async function insertPayrollRecord(record: any) {
  return await safeRunAsync(
    'INSERT INTO payroll_records (id, worker_id, project_id, period_start, period_end, days_worked, overtime_hours, base_amount, overtime_amount, bonus, deductions, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [record.id, record.worker_id, record.project_id, record.period_start, record.period_end, record.days_worked, record.overtime_hours, record.base_amount, record.overtime_amount, record.bonus, record.deductions, record.total_amount, record.status, getCurrentTimestamp()]
  );
}

export async function insertProjectCost(cost: any) {
  return await safeRunAsync(
    'INSERT INTO project_costs (id, project_id, category, description, amount, date, receipt_url, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [cost.id, cost.project_id, cost.category, cost.description, cost.amount, cost.date, cost.receipt_url, cost.notes, cost.created_at]
  );
}

// Site Diary
export async function getSiteDiary(projectId: string, date: string) {
  return await safeGetAllAsync(
    'SELECT * FROM site_diary WHERE project_id = ? AND date = ? ORDER BY shift',
    [projectId, date]
  );
}

export async function insertSiteDiary(diary: any) {
  return await safeRunAsync(
    'INSERT INTO site_diary (id, project_id, date, shift, weather, workforce, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [diary.id, diary.project_id, diary.date, diary.shift, diary.weather, diary.workforce, diary.notes, diary.created_at, diary.updated_at]
  );
}

// WBS Items
export async function getWbsItems(typeCode: string) {
  return await safeGetAllAsync(
    'SELECT * FROM wbs_items WHERE type_code = ? ORDER BY order_index, code',
    [typeCode]
  );
}

export async function insertWbsItem(item: any) {
  return await safeRunAsync(
    'INSERT INTO wbs_items (id, type_code, code, name, uom, qty_total, weight_pct, piecework_total, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [item.id, item.type_code, item.code, item.name, item.uom, item.qty_total, item.weight_pct, item.piecework_total, item.order_index]
  );
}

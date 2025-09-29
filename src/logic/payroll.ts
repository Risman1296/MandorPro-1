// Calculate gross pay based on daily wage, attendance and overtime
export function grossPay(
  dailyWage: number, 
  daysPresent: number, 
  overtimeHours: number = 0, 
  otFactor: number = 1.5, 
  piecework: number = 0
): number {
  const basePay = dailyWage * daysPresent;
  const overtimePay = (dailyWage / 8) * overtimeHours * otFactor;
  const totalPay = basePay + overtimePay + piecework;
  
  return Math.round(totalPay * 100) / 100; // Round to 2 decimal places
}

// Calculate earned piecework from progress delta
export function earnedPieceworkFromProgress(
  prevPercent: number, 
  newPercent: number, 
  itemPieceworkTotal: number
): number {
  const p0 = Math.max(0, Math.min(100, prevPercent));
  const p1 = Math.max(0, Math.min(100, newPercent));
  const delta = Math.max(0, p1 - p0); // Only count increases
  const earned = (delta / 100) * itemPieceworkTotal;
  
  return Math.round(earned);
}

// Allocate piecework earnings based on attendance proportion
export function allocateByAttendance(
  totalEarned: number, 
  attendanceDays: Record<string, number>
): Record<string, number> {
  const totalDays = Object.values(attendanceDays).reduce((sum, days) => sum + days, 0);
  if (totalDays === 0) return {};
  
  const result: Record<string, number> = {};
  
  for (const [workerId, days] of Object.entries(attendanceDays)) {
    const proportion = days / totalDays;
    result[workerId] = Math.round(proportion * totalEarned);
  }
  
  return result;
}

// Types for payroll comparison
export interface WorkerInfo {
  id: string;
  name: string;
  daily_wage: number;
}

export interface ItemDelta {
  prev: number;
  curr: number;
  piecework_total: number;
}

export interface PayrollComparison {
  worker_id: string;
  nama: string;
  hadir: number;
  harian: number;
  borongan: number;
  selisih: number;
}

// Compare weekly pay: daily wage vs piecework allocation
export function compareWeeklyPay(
  workers: WorkerInfo[],
  attendance: Record<string, number>, // worker_id -> days_present
  overtime: Record<string, number>,   // worker_id -> overtime_hours
  itemDeltas: ItemDelta[],
  otFactor: number = 1.5
): PayrollComparison[] {
  
  // 1) Calculate daily wage amounts per worker
  const dailyAmounts: Record<string, number> = {};
  for (const worker of workers) {
    const days = attendance[worker.id] || 0;
    const ot = overtime[worker.id] || 0;
    dailyAmounts[worker.id] = grossPay(worker.daily_wage, days, ot, otFactor, 0);
  }
  
  // 2) Calculate total piecework earned this week from progress deltas
  const totalPiecework = itemDeltas.reduce((sum, item) => {
    return sum + earnedPieceworkFromProgress(item.prev, item.curr, item.piecework_total);
  }, 0);
  
  // 3) Allocate piecework proportionally based on attendance
  const pieceworkAllocation = allocateByAttendance(totalPiecework, attendance);
  
  // 4) Create comparison rows
  return workers.map(worker => {
    const hadir = attendance[worker.id] || 0;
    const harian = Math.round(dailyAmounts[worker.id] || 0);
    const borongan = Math.round(pieceworkAllocation[worker.id] || 0);
    const selisih = borongan - harian; // + means piecework is higher
    
    return {
      worker_id: worker.id,
      nama: worker.name,
      hadir,
      harian,
      borongan,
      selisih
    };
  });
}

// Calculate weekly attendance for a worker
export function calculateWeeklyAttendance(
  attendanceRecords: Array<{
    worker_id: string;
    date: string;
    check_in_time: string | null;
    check_out_time: string | null;
  }>,
  weekStart: string,
  weekEnd: string
): Record<string, number> {
  const result: Record<string, number> = {};
  
  for (const record of attendanceRecords) {
    if (record.date >= weekStart && record.date <= weekEnd && record.check_in_time) {
      if (!result[record.worker_id]) {
        result[record.worker_id] = 0;
      }
      result[record.worker_id] += 1;
    }
  }
  
  return result;
}

// Generate payroll week periods (Monday to Sunday)
export function generatePayrollWeek(date: Date): { weekStart: string; weekEnd: string; weekCode: string } {
  const monday = new Date(date);
  const dayOfWeek = monday.getDay();
  const diff = monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
  monday.setDate(diff);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const weekStart = monday.toISOString().split('T')[0];
  const weekEnd = sunday.toISOString().split('T')[0];
  const weekCode = `W${monday.getFullYear()}${String(monday.getMonth() + 1).padStart(2, '0')}${String(monday.getDate()).padStart(2, '0')}`;
  
  return { weekStart, weekEnd, weekCode };
}
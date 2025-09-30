import { z } from 'zod';

export * from '../schemas/project';
export * from '../schemas/people';

export type ID = string; // use uuid()

// Projects and Units
export const Project = z.object({ 
  id: z.string(), 
  name: z.string(), 
  code: z.string(), 
  start_date: z.string().optional(), 
  end_date: z.string().optional() 
});

export const Unit = z.object({ 
  id: z.string(), 
  project_id: z.string(), 
  block: z.string().optional(), 
  number: z.string().optional(), 
  type_code: z.string(), 
  status: z.string().default('active') 
});

// Work Breakdown Structure
export const WbsItem = z.object({ 
  id: z.string(), 
  type_code: z.string(), 
  code: z.string(), 
  name: z.string(), 
  uom: z.string(), 
  qty_total: z.number(), 
  weight_pct: z.number(), 
  piecework_total: z.number().default(0), 
  order_index: z.number().default(0) 
});

export const UnitProgress = z.object({ 
  id: z.string(), 
  unit_id: z.string(), 
  wbs_id: z.string(), 
  date: z.string(), 
  qty_done: z.number(), 
  percent_done: z.number(), 
  has_qc: z.boolean().default(false), 
  created_by: z.string().optional() 
});

// Workers and Attendance
export const Worker = z.object({ 
  id: z.string(), 
  name: z.string(), 
  skill: z.string().optional(), 
  daily_wage: z.number(), 
  phone: z.string().optional(), 
  active: z.boolean().default(true) 
});

// Payroll
export const PayrollWeek = z.object({ 
  id: z.string(), 
  project_id: z.string(), 
  week_start: z.string(), 
  week_end: z.string(), 
  status: z.enum(['draft','submitted','approved']).default('draft') 
});

export const PayrollLine = z.object({ 
  id: z.string(), 
  payroll_week_id: z.string(), 
  worker_id: z.string(), 
  days_present: z.number(), 
  overtime_hours: z.number().default(0), 
  piecework_amt: z.number().default(0), 
  gross_pay: z.number(), 
  notes: z.string().optional() 
});

// Materials and Stock
export const Material = z.object({ 
  id: z.string(), 
  code: z.string(), 
  name: z.string(), 
  uom: z.string(), 
  min_stock: z.number().default(0), 
  lead_time_days: z.number().default(0) 
});

export const StockLedger = z.object({ 
  id: z.string(), 
  project_id: z.string(), 
  material_id: z.string(), 
  date_time: z.string(), 
  type: z.enum(['IN','OUT','ADJ']), 
  qty: z.number(), 
  ref: z.string().optional(), 
  note: z.string().optional(), 
  unit_id: z.string().optional(), 
  wbs_id: z.string().optional() 
});

// Type exports
export type TProject = z.infer<typeof Project>;
export type TUnit = z.infer<typeof Unit>;
export type TWbsItem = z.infer<typeof WbsItem>;
export type TUnitProgress = z.infer<typeof UnitProgress>;
export type TWorker = z.infer<typeof Worker>;
export type TPayrollWeek = z.infer<typeof PayrollWeek>;
export type TPayrollLine = z.infer<typeof PayrollLine>;
export type TMaterial = z.infer<typeof Material>;
export type TStockLedger = z.infer<typeof StockLedger>;

// Progress Photos
export interface ProgressPhoto {
  id: string;
  unit_progress_id: string;
  uri: string;
  lat?: number;
  lon?: number;
  taken_at: string;
  note?: string;
}

// Site Diary
export interface SiteDiary {
  id: string;
  project_id: string;
  date: string;
  shift: 'Pagi' | 'Siang' | 'Sore';
  weather: string;
  workforce: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DiaryPhoto {
  id: string;
  diary_id: string;
  uri: string;
  lat?: number;
  lon?: number;
  taken_at: string;
  note?: string;
}
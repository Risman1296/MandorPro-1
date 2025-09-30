import { z } from 'zod';

export const AttendanceSchema = z.object({
  id: z.string().uuid(),
  workerId: z.string(),
  projectId: z.string(),
  type: z.enum(['CHECKIN','CHECKOUT']),
  atTs: z.number().int(),
  lat: z.number(),
  lng: z.number(),
  accuracy: z.number().optional().default(0),
  method: z.enum(['AUTO','MANUAL']).default('MANUAL'),
  note: z.string().optional().default(''),
});
export type Attendance = z.infer<typeof AttendanceSchema>;

export const TimesheetSchema = z.object({
  workerId: z.string(),
  projectId: z.string(),
  date: z.string(), // 'YYYY-MM-DD'
  minutesWorked: z.number().int().nonnegative().default(0),
  overtimeMinutes: z.number().int().nonnegative().default(0),
});
export type Timesheet = z.infer<typeof TimesheetSchema>;

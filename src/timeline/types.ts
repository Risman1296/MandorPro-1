import dayjs from 'dayjs';
export type Zoom = 'day'|'week'|'month';

export type TLRow = {
  id: string; title: string;
  startAt: number; dueAt: number;
  status?: 'TODO'|'DOING'|'DONE';
  progress?: number; // 0..100
  group?: string; assigneeId?: string|null; milestoneId?: string|null;
};

export type TLDep = { fromId: string; toId: string; type?: 'FS'|'SS'|'FF'|'SF' };
export type TLMilestone = { id: string; title: string; at: number };

export type TLPrefs = {
  zoom: Zoom; showWeekend: boolean; tz: string; locale: string;
  defaultRangeDays?: number; stickies?: boolean;
};

export const d = (t: number, tz?: string) => (dayjs as any).tz?.(t, tz) ?? dayjs(t);

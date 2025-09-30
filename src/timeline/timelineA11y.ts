import { TLRow } from './types';
export const a11yLabel = (r:TLRow)=> 
  `Tugas ${r.title}, status ${r.status ?? 'TODO'}, ${r.progress ?? 0} persen, mulai ${new Date(r.startAt).toDateString()} sampai ${new Date(r.dueAt).toDateString()}`;

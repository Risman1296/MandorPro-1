import dayjs from 'dayjs';
import { Zoom } from './types';

export const DAY = 86400000;
export const colW = { day: 28, week: 42, month: 56 } as const;

export function rangeFromRows(rows: {startAt:number; dueAt:number}[], padDays=2){
  if (!rows.length){ const now = Date.now(); return [now-7*DAY, now+21*DAY] as const; }
  const minS = Math.min(...rows.map(r=>r.startAt));
  const maxE = Math.max(...rows.map(r=>r.dueAt));
  return [minS - padDays*DAY, maxE + padDays*DAY] as const;
}

export function daysBetween(a:number,b:number){ return Math.ceil((b-a)/DAY); }

export function xAt(ts:number, viewStart:number, zoom:Zoom){
  const unit = zoom==='day'?1: zoom==='week'?7: Math.max(1, dayjs(ts).daysInMonth());
  const days = Math.floor((ts - viewStart)/DAY);
  return Math.max(0, Math.floor(days/unit) * colW[zoom]);
}

export function wOf(s:number,e:number,zoom:Zoom){
  const lenDays = Math.max(1, Math.ceil((e - s)/DAY) + 1);
  const unit = zoom==='day'?1: zoom==='week'?7: 30; // month bucket ~30
  const buckets = Math.max(1, Math.ceil(lenDays/unit));
  return buckets * colW[zoom];
}

export const clamp = (v:number,min:number,max:number)=> Math.min(max, Math.max(min, v));

export function buildTicks(start:number, end:number, zoom:Zoom){
  const out:{x:number; label:string; key:string; isWeekend?:boolean}[]=[];
  const totalDays = daysBetween(start, end);
  for(let i=0;i<=totalDays;i++){
    const ts = start + i*DAY;
    const d = dayjs(ts);
    const label = zoom==='day'  ? d.format('DD MMM')
               : zoom==='week' ? `W${(d as any).week? (d as any).week() : d.format('WW')}`
               : d.format('MMM YYYY');
    const isWeekend = d.day()===0 || d.day()===6;
    out.push({ x: xAt(ts, start, zoom), label, key: d.format('YYYY-MM-DD'), isWeekend });
  }
  return out;
}

export function weekendBlocks(start:number, end:number){
  const blocks:{x:number; w:number}[]=[];
  for(let t=start; t<=end; t+=DAY){
    const d = dayjs(t).day();
    if(d===6){ // Sat start
      const sat = t;
      blocks.push({ x: xAt(sat, start, 'day'), w: 2*colW.day });
    }
  }
  return blocks;
}

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { TLRow, TLDep, TLMilestone, TLPrefs, Zoom } from './types';
import { rangeFromRows, buildTicks, DAY } from './timelineMath';

dayjs.extend(utc); dayjs.extend(timezone); dayjs.extend(weekOfYear);

export function useTimelineEngine(rows:TLRow[], deps:TLDep[], milestones:TLMilestone[], prefs:Partial<TLPrefs>={}){
  const p = { zoom:'day' as Zoom, showWeekend:true, tz:'UTC', locale:'id', defaultRangeDays:28, ...prefs };

  const [view, setView] = useState(()=>{
    const [s,e] = rangeFromRows(rows);
    const today = dayjs().startOf('day').valueOf();
    return { start:s, end:e, today };
  });

  const ticks = useMemo(()=> buildTicks(view.start, view.end, p.zoom), [view, p.zoom]);
  const width = useMemo(()=> {
    const days = Math.ceil((view.end - view.start)/DAY);
    const unit = p.zoom==='day'?1: p.zoom==='week'?7:30;
    const buckets = Math.ceil(days/unit);
    const col = p.zoom==='day'?28: p.zoom==='week'?42:56;
    return buckets * col;
  }, [view, p.zoom]);

  const todayX = useMemo(()=>{
    // Reuse ticks start as viewStart
    return Math.max(0, Math.floor((view.today - view.start) / DAY) * (p.zoom==='day'?28: p.zoom==='week'?42:56));
  }, [view, p.zoom]);

  const api = {
    setZoom: (_z:Zoom)=> setView(v=>({ ...v })),
    gotoToday: ()=> ({ x: todayX }),
    setRange: (start:number, end:number)=> setView({ ...view, start, end }),
    ticks, width, todayX, prefs: p
  };

  return api;
}

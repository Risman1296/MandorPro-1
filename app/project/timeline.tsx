// app/project/timeline.tsx
import TimelineView from '@/src/timeline/TimelineView';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function TimelinePage(){
  const db = useSQLiteContext();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const [rows,setRows]=useState<any[]>([]);
  const [deps,setDeps]=useState<any[]>([]);
  const [miles,setMiles]=useState<any[]>([]);
  useEffect(()=>{ (async ()=>{
    const r = await db.getAllAsync(
      `SELECT id,title,start_at as startAt,due_at as dueAt,status,progress FROM tasks
       WHERE project_id = COALESCE(?, project_id) AND start_at IS NOT NULL AND due_at IS NOT NULL
       ORDER BY start_at ASC`,
      [projectId ?? null]
    );
    setRows(r); setDeps([]); setMiles([]);
  })(); },[db, projectId]);

  return <TimelineView rows={rows} deps={deps} milestones={miles} prefs={{ zoom:'day', tz: 'Asia/Jakarta', locale:'id' }} />;
}
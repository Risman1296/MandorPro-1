// app/project/tasks.tsx
import { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

type Task = {
  id: string;
  projectId: string;
  title: string;
  desc?: string;
  status: 'TODO'|'DOING'|'DONE';
  priority?: 'LOW'|'MEDIUM'|'HIGH';
  startAt?: number;
  dueAt?: number;
  assigneeId?: string|null;
  progress?: number;
};

const STATUSES: Task['status'][] = ['TODO','DOING','DONE'];

export default function ProjectTasksPage() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await db.getAllAsync<Task>(
        `SELECT id, project_id as projectId, title, desc, status, priority, start_at as startAt, due_at as dueAt, assignee_id as assigneeId, progress
         FROM tasks
         WHERE project_id = COALESCE(?, project_id)`,
        [projectId ?? null],
      );
      setTasks(res);
    } finally { setLoading(false); }
  }, [db, projectId]);

  const byStatus = useMemo(() => {
    const map: Record<string, Task[]> = { TODO:[], DOING:[], DONE:[] };
    for (const t of tasks) map[t.status].push(t);
    return map;
  }, [tasks]);

  const onToggleStatus = async (t: Task) => {
    const next: Task['status'] =
      t.status === 'TODO' ? 'DOING' : t.status === 'DOING' ? 'DONE' : 'TODO';
    await db.runAsync(`UPDATE tasks SET status=? WHERE id=?`, [next, t.id]);
    setTasks(prev => prev.map(p => (p.id === t.id ? { ...p, status: next } : p)));
  };

  return (
    <View style={{ flex: 1, paddingTop: headerHeight, paddingBottom: insets.bottom }}>
      {/* Header mini */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Tugas</Text>
        <Pressable onPress={() => router.push({ pathname: '/project/new-task', params: { projectId } })}>
          <Text style={{ fontWeight: '600' }}>+ Tambah</Text>
        </Pressable>
      </View>

      {/* Kanban horizontal */}
      <FlatList
        data={STATUSES}
        keyExtractor={(s) => s}
        horizontal
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
        renderItem={({ item: status }) => (
          <View style={{ width: 280, marginRight: 12, backgroundColor: '#f4f4f5', borderRadius: 16, padding: 12 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>{status}</Text>
            <FlatList
              data={byStatus[status]}
              keyExtractor={(t) => t.id}
              ListEmptyComponent={<Text style={{ opacity: 0.6 }}>Tidak ada</Text>}
              renderItem={({ item: t }) => (
                <Pressable
                  onLongPress={() => onToggleStatus(t)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 1,
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>{t.title}</Text>
                  {t.dueAt ? <Text style={{ fontSize: 12, opacity: 0.7 }}>Due: {new Date(t.dueAt).toLocaleDateString()}</Text> : null}
                  {t.progress != null ? <Text style={{ fontSize: 12, opacity: 0.7 }}>Progress: {t.progress}%</Text> : null}
                </Pressable>
              )}
            />
          </View>
        )}
        onMomentumScrollEnd={() => !loading && load()}
        onLayout={() => load()}
      />
    </View>
  );
}
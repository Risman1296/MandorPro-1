import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { Card, Button, SectionHeader, ListItem, StatusBadge } from '@/src/ui/components';
import { theme } from '@/src/ui/theme';
import { getActiveWorkers, getTodayAttendance, insertAttendance } from '@/src/db/queries';
import { getCurrentDate, getCurrentTimestamp, formatTime } from '@/src/utils/time';
import { generateId } from '@/src/utils/id';
import { appendDelta } from '@/src/services/outbox';

export default function AttendanceScreen() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const projectId = 'PROJECT-001'; // Mock project ID
  const deviceId = 'MOBILE-001'; // Mock device ID
  const currentDate = getCurrentDate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const workersData = await getActiveWorkers();
      const attendanceData = await getTodayAttendance(projectId, currentDate);
      
      setWorkers(workersData || []);
      setTodayAttendance(attendanceData || []);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
      Alert.alert('Error', 'Gagal memuat data absensi');
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getWorkerAttendance = (workerId: string) => {
    return todayAttendance.find(att => att.worker_id === workerId);
  };

  const handleCheckIn = async (workerId: string) => {
    try {
      setLoading(true);
      const attendanceId = generateId();
      const now = getCurrentTimestamp();
      
      const attendance = {
        id: attendanceId,
        worker_id: workerId,
        project_id: projectId,
        date: currentDate,
        check_in_time: now,
        check_out_time: null,
        method: 'GPS',
        device_id: deviceId,
      };

      insertAttendance(attendance);
      
      // Add to sync outbox
      await appendDelta({
        ts: now,
        device: deviceId,
        op: 'UPSERT',
        table: 'attendance',
        pk: attendanceId,
        data: attendance,
      });

      await loadData();
      Alert.alert('Berhasil', 'Check-in berhasil dicatat');
    } catch (error) {
      Alert.alert('Error', 'Gagal melakukan check-in: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (workerId: string) => {
    try {
      setLoading(true);
      const attendance = getWorkerAttendance(workerId);
      if (!attendance) {
        Alert.alert('Error', 'Data check-in tidak ditemukan');
        return;
      }

      const now = getCurrentTimestamp();
      
      // Update check-out time in database (you'd need to add this query)
      // updateAttendanceCheckOut(attendance.id, now);
      
      // Add to sync outbox
      await appendDelta({
        ts: now,
        device: deviceId,
        op: 'UPSERT',
        table: 'attendance',
        pk: attendance.id,
        data: { ...attendance, check_out_time: now },
      });

      await loadData();
      Alert.alert('Berhasil', 'Check-out berhasil dicatat');
    } catch (error) {
      Alert.alert('Error', 'Gagal melakukan check-out: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkerItem = (worker: any) => {
    const attendance = getWorkerAttendance(worker.id);
    const isCheckedIn = attendance && attendance.check_in_time && !attendance.check_out_time;
    const isCheckedOut = attendance && attendance.check_in_time && attendance.check_out_time;
    
    return (
      <Card key={worker.id} style={styles.workerCard}>
        <View style={styles.workerHeader}>
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerSkill}>{worker.skill || 'Pekerja'}</Text>
          </View>
          {isCheckedOut && (
            <StatusBadge status="success" text="Selesai" />
          )}
          {isCheckedIn && (
            <StatusBadge status="warning" text="Masuk" />
          )}
          {!attendance && (
            <StatusBadge status="danger" text="Belum Absen" />
          )}
        </View>
        
        {attendance && (
          <View style={styles.attendanceInfo}>
            <Text style={styles.timeText}>
              Masuk: {formatTime(attendance.check_in_time)}
            </Text>
            {attendance.check_out_time && (
              <Text style={styles.timeText}>
                Keluar: {formatTime(attendance.check_out_time)}
              </Text>
            )}
          </View>
        )}

        <View style={styles.actionButtons}>
          {!attendance && (
            <Button
              title="Check In"
              onPress={() => handleCheckIn(worker.id)}
              variant="success"
              size="small"
              disabled={loading}
            />
          )}
          {isCheckedIn && (
            <Button
              title="Check Out"
              onPress={() => handleCheckOut(worker.id)}
              variant="warning"
              size="small"
              disabled={loading}
            />
          )}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <SectionHeader 
          title="Absensi Harian" 
          subtitle={`${currentDate} • ${todayAttendance.length} dari ${workers.length} pekerja`}
        />
        
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama pekerja..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Card>

      <View style={styles.workersList}>
        {filteredWorkers.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Pekerja tidak ditemukan' : 'Belum ada data pekerja'}
            </Text>
          </Card>
        ) : (
          filteredWorkers.map(renderWorkerItem)
        )}
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <SectionHeader title="Ringkasan Hari Ini" />
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayAttendance.filter(a => a.check_in_time).length}</Text>
            <Text style={styles.statLabel}>Check In</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todayAttendance.filter(a => a.check_out_time).length}</Text>
            <Text style={styles.statLabel}>Check Out</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{workers.length - todayAttendance.length}</Text>
            <Text style={styles.statLabel}>Belum Absen</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  headerCard: {
    margin: theme.spacing.lg,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.base,
    marginTop: theme.spacing.md,
  },
  workersList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  workerCard: {
    marginBottom: theme.spacing.md,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  workerSkill: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  attendanceInfo: {
    marginBottom: theme.spacing.sm,
  },
  timeText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSizes.base,
    padding: theme.spacing.xl,
  },
  summaryCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.primary[500],
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});
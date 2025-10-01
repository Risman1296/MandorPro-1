// 📁 app/dashboard/index.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, Platform } from 'react-native';
import { ConstructionTheme } from '@/src/constants/Theme';
import { Button } from '@/src/components/common/Button';
import { DataCard } from '@/src/components/common/DataCard';
import { router } from 'expo-router';

interface DashboardStats {
  activeProjects: number;
  todayWorkers: number;
  criticalMaterials: number;
  monthlyProgress: number;
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 3,
    todayWorkers: 24,
    criticalMaterials: 2,
    monthlyProgress: 68,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        activeProjects: Math.floor(Math.random() * 5) + 1,
        todayWorkers: Math.floor(Math.random() * 30) + 15,
        criticalMaterials: Math.floor(Math.random() * 5),
        monthlyProgress: Math.floor(Math.random() * 40) + 50,
      });
      setRefreshing(false);
    }, 1000);
  }, []);

  const quickActions = [
    { 
      title: 'Absensi Hari Ini', 
      icon: '👥', 
      onPress: () => router.push('/absensi'),
      subtitle: '24 pekerja hadir'
    },
    { 
      title: 'Cek Material', 
      icon: '📦', 
      onPress: () => router.push('/material'),
      subtitle: '2 item kritis'
    },
    { 
      title: 'Laporan Harian', 
      icon: '📊', 
      onPress: () => router.push('/report'),
      subtitle: 'Belum dibuat'
    },
    { 
      title: 'Progress Proyek', 
      icon: '🏗️', 
      onPress: () => router.push('/progres'),
      subtitle: '68% selesai'
    },
  ];

  const recentActivities = [
    {
      text: 'Ahmad Sutanto check-in di Proyek Apartemen Blok A',
      time: '08:00 WIB',
      type: 'attendance',
    },
    {
      text: 'Material Semen Portland hampir habis (10 sak tersisa)',
      time: '07:30 WIB',
      type: 'warning',
    },
    {
      text: 'Progress lantai 3 Blok B mencapai 75%',
      time: 'Kemarin, 17:00 WIB',
      type: 'progress',
    },
    {
      text: 'Budi Prasetyo mengajukan lembur untuk hari ini',
      time: 'Kemarin, 16:30 WIB',
      type: 'request',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return '👤';
      case 'warning': return '⚠️';
      case 'progress': return '📈';
      case 'request': return '📝';
      default: return '📌';
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Welcome */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Pagi, Mandor! 👋</Text>
        <Text style={styles.dateText}>{getCurrentDate()}</Text>
        <Text style={styles.timeText}>Waktu saat ini: {getCurrentTime()} WIB</Text>
      </View>

      {/* Weather Info (Mock) */}
      <View style={styles.weatherCard}>
        <Text style={styles.weatherText}>🌤️ Cerah, 28°C - Kondisi baik untuk konstruksi</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Ringkasan Hari Ini</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <DataCard
              title="Proyek Aktif"
              value={stats.activeProjects}
              icon="🏗️"
              variant="highlight"
              trend={{ value: 12, isPositive: true }}
              onPress={() => router.push('/project')}
            />
            <DataCard
              title="Pekerja Hadir"
              value={stats.todayWorkers}
              icon="👷"
              variant="success"
              subtitle="dari 30 pekerja"
              onPress={() => router.push('/worker')}
            />
          </View>
          <View style={styles.statRow}>
            <DataCard
              title="Material Kritis"
              value={stats.criticalMaterials}
              icon="📦"
              variant={stats.criticalMaterials > 0 ? "warning" : "default"}
              subtitle="perlu diperhatikan"
              onPress={() => router.push('/material')}
            />
            <DataCard
              title="Progress Bulan Ini"
              value={${stats.monthlyProgress}%}
              icon="📊"
              variant="default"
              trend={{ value: 8, isPositive: true }}
              onPress={() => router.push('/progres')}
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <View key={index} style={styles.actionCard}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              <Button 
                title="Buka"
                size="sm"
                variant="outline"
                onPress={action.onPress}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktivitas Terkini</Text>
        <View style={styles.activityList}>
          {recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.text}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Actions */}
      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>🆘 Butuh Bantuan Cepat?</Text>
        <Text style={styles.emergencySubtitle}>
          Gunakan tombol di bawah untuk situasi darurat atau bantuan segera
        </Text>
        <View style={styles.emergencyButtons}>
          <Button 
            title="Lapor Masalah Urgent"
            icon="🚨"
            variant="danger" 
            size="md"
            fullWidth
            onPress={() => {/* Handle emergency report */}}
          />
          <Button 
            title="Panggil Supervisor"
            icon="📞"
            variant="outline" 
            size="md"
            fullWidth
            onPress={() => {/* Handle supervisor call */}}
          />
        </View>
      </View>

      {/* Footer spacing */}
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ConstructionTheme.colors.background,
  },
  header: {
    padding: ConstructionTheme.spacing.lg,
    paddingBottom: ConstructionTheme.spacing.md,
  },
  welcomeText: {
    ...ConstructionTheme.typography.h1,
    color: ConstructionTheme.colors.dark,
    marginBottom: ConstructionTheme.spacing.xs,
  },
  dateText: {
    ...ConstructionTheme.typography.body,
    color: ConstructionTheme.colors.medium,
    marginBottom: ConstructionTheme.spacing.xs,
  },
  timeText: {
    ...ConstructionTheme.typography.caption,
    color: ConstructionTheme.colors.medium,
  },
  weatherCard: {
    backgroundColor: ConstructionTheme.colors.surface,
    marginHorizontal: ConstructionTheme.spacing.lg,
    padding: ConstructionTheme.spacing.md,
    borderRadius: ConstructionTheme.borderRadius.md,
    marginBottom: ConstructionTheme.spacing.lg,
    ...ConstructionTheme.shadows.sm,
  },
  weatherText: {
    ...ConstructionTheme.typography.body,
    color: ConstructionTheme.colors.dark,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: ConstructionTheme.spacing.lg,
    marginBottom: ConstructionTheme.spacing.xl,
  },
  sectionTitle: {
    ...ConstructionTheme.typography.h3,
    color: ConstructionTheme.colors.dark,
    marginBottom: ConstructionTheme.spacing.md,
  },
  statsGrid: {
    gap: ConstructionTheme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ConstructionTheme.spacing.md,
  },
  section: {
    paddingHorizontal: ConstructionTheme.spacing.lg,
    marginBottom: ConstructionTheme.spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: ConstructionTheme.spacing.md,
  },
  actionCard: {
    width: Platform.OS === 'web' ? '48%' : '48%',
    backgroundColor: ConstructionTheme.colors.surface,
    padding: ConstructionTheme.spacing.lg,
    borderRadius: ConstructionTheme.borderRadius.lg,
    ...ConstructionTheme.shadows.sm,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: ConstructionTheme.spacing.sm,
  },
  actionTitle: {
    ...ConstructionTheme.typography.caption,
    color: ConstructionTheme.colors.dark,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: ConstructionTheme.spacing.xs,
  },
  actionSubtitle: {
    ...ConstructionTheme.typography.small,
    color: ConstructionTheme.colors.medium,
    textAlign: 'center',
    marginBottom: ConstructionTheme.spacing.md,
  },
  activityList: {
    backgroundColor: ConstructionTheme.colors.surface,
    borderRadius: ConstructionTheme.borderRadius.lg,
    ...ConstructionTheme.shadows.sm,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: ConstructionTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ConstructionTheme.colors.border,
  },
  activityIcon: {
    fontSize: 16,
    marginRight: ConstructionTheme.spacing.md,
    marginTop: ConstructionTheme.spacing.xs,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...ConstructionTheme.typography.body,
    color: ConstructionTheme.colors.dark,
    marginBottom: ConstructionTheme.spacing.xs,
    lineHeight: 20,
  },
  activityTime: {
    ...ConstructionTheme.typography.small,
    color: ConstructionTheme.colors.medium,
  },
  emergencySection: {
    backgroundColor: ConstructionTheme.colors.surface,
    marginHorizontal: ConstructionTheme.spacing.lg,
    padding: ConstructionTheme.spacing.lg,
    borderRadius: ConstructionTheme.borderRadius.lg,
    ...ConstructionTheme.shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: ConstructionTheme.colors.danger,
  },
  emergencyTitle: {
    ...ConstructionTheme.typography.h3,
    color: ConstructionTheme.colors.dark,
    marginBottom: ConstructionTheme.spacing.sm,
    textAlign: 'center',
  },
  emergencySubtitle: {
    ...ConstructionTheme.typography.caption,
    color: ConstructionTheme.colors.medium,
    textAlign: 'center',
    marginBottom: ConstructionTheme.spacing.lg,
    lineHeight: 18,
  },
  emergencyButtons: {
    gap: ConstructionTheme.spacing.md,
  },
  footer: {
    height: ConstructionTheme.spacing.xl,
  },
});

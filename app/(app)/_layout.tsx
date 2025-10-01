// 📁 app/(app)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { ConstructionTheme } from '@/src/constants/Theme';

// For web, we'll use text icons. For mobile, you can install @expo/vector-icons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons = {
    dashboard: focused ? '🏠' : '🏘️',
    project: focused ? '🏗️' : '🏢',
    worker: focused ? '👷' : '👥',
    material: focused ? '📦' : '📋',
    gaji: focused ? '💰' : '💵',
  };
  
  return icons[name as keyof typeof icons] || '📌';
};

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ConstructionTheme.colors.primary,
        tabBarInactiveTintColor: ConstructionTheme.colors.medium,
        tabBarStyle: {
          backgroundColor: ConstructionTheme.colors.surface,
          borderTopColor: ConstructionTheme.colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 90 : 60,
          ...ConstructionTheme.shadows.md,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: ConstructionTheme.colors.primary,
          ...ConstructionTheme.shadows.sm,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerTitle: 'Dashboard Mandor',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="dashboard" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="project"
        options={{
          title: 'Proyek',
          headerTitle: 'Manajemen Proyek',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="project" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="worker"
        options={{
          title: 'Pekerja',
          headerTitle: 'Manajemen Pekerja',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="worker" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="material"
        options={{
          title: 'Material',
          headerTitle: 'Manajemen Material',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="material" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="gaji"
        options={{
          title: 'Gaji',
          headerTitle: 'Sistem Penggajian',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="gaji" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

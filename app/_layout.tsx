import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ConstructionTheme } from '@/src/constants/Theme';
import { StyleSheet, Platform } from 'react-native';
import { initDb } from '@/src/db/boot';

export default function RootLayout() {
  useEffect(() => {
    initDb().catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor={ConstructionTheme.colors.primary} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: ConstructionTheme.colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: true,
            contentStyle: {
              backgroundColor: ConstructionTheme.colors.background,
            },
            animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'MandorPro - Dashboard',
              headerStyle: {
                backgroundColor: ConstructionTheme.colors.primary,
              },
            }} 
          />
          <Stack.Screen 
            name="dashboard/index" 
            options={{ 
              title: 'Dashboard Mandor',
              headerStyle: {
                backgroundColor: ConstructionTheme.colors.primary,
              },
            }} 
          />
          <Stack.Screen 
            name="project/index" 
            options={{ 
              title: 'Manajemen Proyek',
              headerStyle: {
                backgroundColor: ConstructionTheme.colors.primary,
              },
            }} 
          />
          <Stack.Screen 
            name="worker/index" 
            options={{ 
              title: 'Manajemen Pekerja',
              headerStyle: {
                backgroundColor: ConstructionTheme.colors.primary,
              },
            }} 
          />
          <Stack.Screen 
            name="material/index" 
            options={{ 
              title: 'Manajemen Material',
              headerStyle: {
                backgroundColor: ConstructionTheme.colors.primary,
              },
            }} 
          />
          <Stack.Screen 
            name="gaji/index" 
            options={{ 
              title: 'Sistem Penggajian',
              headerStyle: {
                backgroundColor: ConstructionTheme.colors.primary,
              },
            }} 
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ConstructionTheme.colors.background,
  },
});

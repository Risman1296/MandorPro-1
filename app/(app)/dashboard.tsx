// 📁 app/(app)/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConstructionTheme } from '@/src/constants/Theme';
import { router } from 'expo-router';
import { Button } from '@/src/components/common/Button';

export default function DashboardTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Utama</Text>
      <Text style={styles.subtitle}>
        Akses dashboard lengkap untuk monitoring operasional konstruksi
      </Text>
      
      <Button
        title="Buka Dashboard Lengkap"
        icon="🚀"
        onPress={() => router.push('/dashboard')}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ConstructionTheme.colors.background,
    padding: ConstructionTheme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...ConstructionTheme.typography.h2,
    color: ConstructionTheme.colors.dark,
    marginBottom: ConstructionTheme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...ConstructionTheme.typography.body,
    color: ConstructionTheme.colors.medium,
    textAlign: 'center',
    marginBottom: ConstructionTheme.spacing.xl,
    lineHeight: 24,
  },
});

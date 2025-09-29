import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type TabItem = { id: string; label: string; disabled?: boolean };
export type SubTabBarProps = {
  items: TabItem[];
  activeId: string | null | undefined;
  onChange: (id: string) => void;
  ariaLabel: string;
};

export default function SubTabBar({ items, activeId, onChange, ariaLabel }: SubTabBarProps) {
  if (!items?.length) return null;
  return (
    <View accessibilityRole="tablist" accessibilityLabel={ariaLabel} style={styles.container}>
      {items.map((t) => {
        const active = t.id === activeId;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: !!t.disabled }}
            onPress={() => !t.disabled && onChange(t.id)}
            style={[styles.tab, active && styles.activeTab, t.disabled && styles.disabled]}
          >
            <Text style={[styles.tabText, active && styles.activeTabText]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6, borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  activeTab: { backgroundColor: '#0ea5e9' },
  disabled: { opacity: 0.5 },
  tabText: { color: '#334155' },
  activeTabText: { color: '#fff', fontWeight: '600' },
});

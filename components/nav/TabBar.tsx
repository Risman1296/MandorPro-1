import React, { useMemo, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, AccessibilityInfo } from 'react-native';

export type TabItem = { id: string; label: string; disabled?: boolean };
export type TabBarProps = {
  items: TabItem[];
  activeId: string | null | undefined;
  onChange: (id: string) => void;
  ariaLabel: string;
};

export default function TabBar({ items, activeId, onChange, ariaLabel }: TabBarProps) {
  const activeIdx = useMemo(() => items.findIndex(t => t.id === activeId), [items, activeId]);
  const refs = useRef<Array<any>>([]);

  const moveAndSelect = (targetIdx: number) => {
    const idx = ((targetIdx % items.length) + items.length) % items.length;
    const next = items[idx];
    if (!next || next.disabled) return;
    refs.current[idx]?.focus?.();
    onChange(next.id);
  };

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={ariaLabel}
      // @ts-ignore web-only keyboard handling
      onKeyDownCapture={(e: any) => {
        const start = activeIdx >= 0 ? activeIdx : 0;
        if (e.key === 'ArrowRight') { e.preventDefault(); moveAndSelect(start + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveAndSelect(start - 1); }
        if (e.key === 'Home') { e.preventDefault(); moveAndSelect(0); }
        if (e.key === 'End') { e.preventDefault(); moveAndSelect(items.length - 1); }
      }}
      style={styles.container}
    >
      {items.map((t, i) => {
        const active = t.id === activeId;
        return (
          <Pressable
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: !!t.disabled }}
            onPress={() => !t.disabled && onChange(t.id)}
            // @ts-ignore - web only
            onKeyDownCapture={(e: any) => {
              if ((e.key === 'Enter' || e.key === ' ') && !t.disabled) { e.preventDefault(); onChange(t.id); }
            }}
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
  container: { flexDirection: 'row', gap: 8, borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  activeTab: { backgroundColor: '#3b82f6' },
  disabled: { opacity: 0.5 },
  tabText: { color: '#334155', fontWeight: '500' },
  activeTabText: { color: '#fff' },
});

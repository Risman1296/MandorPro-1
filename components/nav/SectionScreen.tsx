import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { NAV_TREE, SubTab } from '../../src/data/navTree';
import TabBar from './TabBar';
import SubTabBar from './SubTabBar';
import PageContainer from './PageContainer';
import StockList from '../material/StockList';
import UsageList from '../material/UsageList';
import WeeklyExport from '../reports/WeeklyExport';
import DailyReport from '../reports/DailyReport';

export default function SectionScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ tab?: string; sub?: string }>();
  const sectionId = pathname.replace(/^\//, '').split('/')[0] || '';
  const current = NAV_TREE.find((n) => n.id === sectionId);

  const tabs = current?.tabs ?? [];
  const tabIds = useMemo<string[]>(() => tabs.map((t) => t.id), [tabs]);
  const activeTabId = (params.tab as string | undefined) && tabIds.includes(params.tab as string)
    ? (params.tab as string)
    : (tabs[0]?.id ?? null);
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const subTabs: SubTab[] = (activeTab && 'subTabs' in activeTab && Array.isArray(activeTab.subTabs)) ? activeTab.subTabs : [];
  const subIds = useMemo<string[]>(() => subTabs.map((s: SubTab) => s.id), [subTabs]);
  const activeSubId = (params.sub as string | undefined) && subIds.includes(params.sub as string)
    ? (params.sub as string)
    : (subTabs[0]?.id ?? null);

  // Ensure URL always has correct defaults
  useEffect(() => {
    if (!current) return;
    const nextParams: Record<string, string | undefined> = {};
    if (activeTabId) nextParams.tab = activeTabId;
    if (subTabs.length) {
      if (activeSubId) nextParams.sub = activeSubId;
    } else {
      nextParams.sub = undefined;
    }
    const changed = (params.tab as string | undefined) !== nextParams.tab || (params.sub as string | undefined) !== nextParams.sub;
    if (changed) {
      router.replace({ pathname, params: nextParams as any });
    }
  }, [current, activeTabId, activeSubId, subTabs.length]);

  const onChangeTab = (id: string) => {
    const newTab = tabs.find((t) => t.id === id);
  const firstSub = (newTab && 'subTabs' in newTab && Array.isArray(newTab.subTabs)) ? newTab.subTabs[0]?.id : undefined;
    router.replace({ pathname, params: { tab: id, ...(firstSub ? { sub: firstSub } : {}) } as any });
  };

  const onChangeSub = (id: string) => {
    router.replace({ pathname, params: { tab: activeTabId || undefined, sub: id } as any });
  };

  if (!current) {
    return (
      <PageContainer fluid>
        <View style={{ padding: 16, gap: 8 }}>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Section tidak ditemukan</Text>
          <Text style={{ color: '#64748b' }}>
            Bagian yang kamu akses belum terdaftar di menu.
          </Text>
          <Pressable onPress={() => router.push('/dashboard')} accessibilityRole="link">
            <Text style={{ color: '#2563eb', marginTop: 8 }}>← Kembali ke Dashboard</Text>
          </Pressable>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer fluid>
      {!!tabs.length && (
        <TabBar
          items={tabs.map((t) => ({ id: t.id, label: t.label }))}
          activeId={activeTabId}
          onChange={onChangeTab}
          ariaLabel={`${current.label} tabs`}
        />
      )}
      {!!subTabs.length && (
        <SubTabBar
          items={subTabs.map((s: SubTab) => ({ id: s.id, label: s.label }))}
          activeId={activeSubId}
          onChange={onChangeSub}
          ariaLabel={`${activeTab?.label} sub-tabs`}
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
          {current.label}
          {activeTabId ? ` / ${activeTab?.label}` : ''}
          {activeSubId ? ` / ${subTabs.find((s: SubTab) => s.id === activeSubId)?.label}` : ''}
        </Text>
        {/* Material: Stock */}
        {current.id === 'material' && activeTabId === 'stock' && (
          <StockList />
        )}
        {/* Material: Usage */}
        {current.id === 'material' && activeTabId === 'usage' && (
          <UsageList />
        )}
        {/* Laporan: Export */}
        {current.id === 'laporan' && activeTabId === 'export' && (
          <WeeklyExport />
        )}
        {/* Laporan: Harian */}
        {current.id === 'laporan' && activeTabId === 'daily' && (
          <DailyReport />
        )}
        {/* Report (legacy section) tab daily */}
        {current.id === 'report' && activeTabId === 'daily' && (
          <DailyReport />
        )}
        {/* Default helper text */}
        {!(current.id === 'material' && (activeTabId === 'stock' || activeTabId === 'usage')) &&
          !(current.id === 'laporan' && (activeTabId === 'export' || activeTabId === 'daily')) &&
          !(current.id === 'report' && activeTabId === 'daily') && (
          <Text style={{ color: '#475569' }}>
            This is a data-driven SectionScreen using URL as source of truth.
          </Text>
        )}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, minWidth: 0, minHeight: 0, paddingTop: 12 },
});

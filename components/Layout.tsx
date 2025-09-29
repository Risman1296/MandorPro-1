import React, { useEffect, useMemo, useState } from 'react';
import { Platform, View, useWindowDimensions, Pressable, Text } from 'react-native';
import Sidebar from './Sidebar';
import { sidebar as SB, spacing } from '@/src/ui/tokens';
import { NAV_TREE } from '../src/data/navTree';

const SB_EXPANDED = SB.drawerWidth;
const SB_COLLAPSED = SB.railWidth;
const DESKTOP_BP = 1024;

function useIsDesktop() {
  const { width } = useWindowDimensions();
  return width >= DESKTOP_BP;
}

export default function Layout({ children }: { children?: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' && localStorage.getItem('sb:collapsed') === '1';
    }
    return false;
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarWidth = useMemo(
    () => (isDesktop ? (collapsed ? SB_COLLAPSED : SB_EXPANDED) : 0),
    [isDesktop, collapsed]
  );

  // Persist width and collapsed state on web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--sb-w', `${sidebarWidth}px`);
      localStorage.setItem('sb:collapsed', collapsed ? '1' : '0');
    }
  }, [sidebarWidth, collapsed]);

  // Lock scroll when drawer is open on mobile web
  useEffect(() => {
    if (Platform.OS !== 'web' || isDesktop || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = drawerOpen ? 'hidden' : prev || '';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen, isDesktop]);

  return (
    <View style={{ 
      flexDirection: isDesktop ? 'row' : 'column',
      backgroundColor: '#f8fafc',
      flex: 1,
      ...(Platform.select({
        web: { minHeight: '100vh' },
        default: {},
      }) as any)
    }}>
      {/* Desktop: sidebar */}
      {isDesktop && (
        <View
          style={{
            width: sidebarWidth,
            borderRightWidth: 1,
            borderRightColor: '#e5e7eb',
            backgroundColor: 'white',
            transitionProperty: 'width',
            transitionDuration: '200ms',
          } as any}
        >
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} items={NAV_TREE} />
        </View>
      )}

      {/* Mobile: topbar + drawer */}
      {!isDesktop && (
        <View
          style={{
            position: 'sticky' as any,
            top: 0,
            zIndex: 30,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Pressable
            accessibilityLabel="Open sidebar"
            onPress={() => setDrawerOpen(true)}
            style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
          >
            <Text style={{ fontSize: 18 }}>☰</Text>
          </Pressable>
          <Text style={{ fontWeight: '600' }}>MandorPro</Text>
        </View>
      )}

      {/* Drawer overlay */}
      {!isDesktop && drawerOpen && (
        <View style={{ position: 'fixed' as any, inset: 0, zIndex: 40 }}>
          <Pressable
            onPress={() => setDrawerOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)' } as any}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 280,
              backgroundColor: 'white',
              ...(Platform.select({
                web: { boxShadow: '4px 0 12px rgba(0,0,0,0.2)' },
                default: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12 },
              }) as any),
            }}
          >
            <Sidebar collapsed={false} onToggle={() => setDrawerOpen(false)} items={NAV_TREE} />
          </View>
        </View>
      )}

      {/* Content */}
      <View
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          backgroundColor: '#fff',
          ...(Platform.select({ web: { overflow: 'auto' } }) as any)
        }}
      >
        <View style={{ width: '100%', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, minWidth: 0, minHeight: 0 }}>
          {children}
        </View>
      </View>
    </View>
  );
}
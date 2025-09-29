import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Link, usePathname } from 'expo-router';
import type { NavNode } from '../src/data/navTree';

// Professional icon mapping using Unicode symbols
const IconMap: { [key: string]: string } = {
  'menu-outline': '≡',
  'grid-outline': '▣',
  'briefcase-outline': '■',
  'people-outline': '👥',
  'cube-outline': '□',
  'card-outline': '◈',
  'document-text-outline': '◉',
  'settings-outline': '⚙',
  'list-outline': '☰',
  'checkbox-outline': '☑',
  'time-outline': '◷',
  'person-outline': '◑',
  'calendar-outline': '◫',
  'clipboard-outline': '◪',
  'receipt-outline': '◒',
  'calculator-outline': '◐',
  'analytics-outline': '◈',
  'chevron-down': '▼',
  'chevron-forward': '▶',
  'construct': '⚒',
};

// Professional icon component with geometric shapes
const ProfessionalIcon = ({ name, size = 20, color = '#64748b', style }: { name: string; size?: number; color?: string; style?: any }) => {
  const getIconShape = (iconName: string) => {
    const shapes: { [key: string]: React.ReactElement } = {
      'menu-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: size * 0.8, height: 2, backgroundColor: color, marginBottom: 3, borderRadius: 1 }} />
          <View style={{ width: size * 0.8, height: 2, backgroundColor: color, marginBottom: 3, borderRadius: 1 }} />
          <View style={{ width: size * 0.8, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      ),
      'grid-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: size * 0.35, height: size * 0.35, backgroundColor: color, marginRight: 3, marginBottom: 3, borderRadius: 2 }} />
            <View style={{ width: size * 0.35, height: size * 0.35, backgroundColor: color, marginBottom: 3, borderRadius: 2 }} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: size * 0.35, height: size * 0.35, backgroundColor: color, marginRight: 3, borderRadius: 2 }} />
            <View style={{ width: size * 0.35, height: size * 0.35, backgroundColor: color, borderRadius: 2 }} />
          </View>
        </View>
      ),
      'briefcase-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: size * 0.8, 
            height: size * 0.6, 
            borderWidth: 2, 
            borderColor: color, 
            backgroundColor: 'transparent',
            borderRadius: 3
          }} />
          <View style={{ 
            width: size * 0.4, 
            height: 4, 
            backgroundColor: color, 
            position: 'absolute',
            top: size * 0.15,
            borderRadius: 2
          }} />
        </View>
      ),
      'people-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ 
              width: size * 0.28, 
              height: size * 0.28, 
              borderRadius: size * 0.14, 
              borderWidth: 1.5, 
              borderColor: color,
              backgroundColor: 'transparent',
              marginRight: 3
            }} />
            <View style={{ 
              width: size * 0.28, 
              height: size * 0.28, 
              borderRadius: size * 0.14, 
              borderWidth: 1.5, 
              borderColor: color,
              backgroundColor: 'transparent'
            }} />
          </View>
          <View style={{ 
            width: size * 0.65, 
            height: size * 0.3, 
            borderWidth: 1.5, 
            borderColor: color,
            backgroundColor: 'transparent',
            borderTopLeftRadius: size * 0.15,
            borderTopRightRadius: size * 0.15,
            marginTop: 3
          }} />
        </View>
      ),
      'cube-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: size * 0.7, 
            height: size * 0.7, 
            borderWidth: 2, 
            borderColor: color,
            backgroundColor: 'transparent',
            borderRadius: 3,
            transform: [{ rotate: '45deg' }]
          }} />
        </View>
      ),
      'card-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: size * 0.8, 
            height: size * 0.55, 
            borderWidth: 2, 
            borderColor: color,
            backgroundColor: 'transparent',
            borderRadius: 4
          }} />
          <View style={{ 
            width: size * 0.6, 
            height: 2, 
            backgroundColor: color,
            position: 'absolute',
            top: size * 0.45
          }} />
        </View>
      ),
      'document-text-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: size * 0.65, 
            height: size * 0.8, 
            borderWidth: 2, 
            borderColor: color,
            backgroundColor: 'transparent',
            borderRadius: 2
          }} />
          <View style={{ 
            width: size * 0.45, 
            height: 1.5, 
            backgroundColor: color,
            position: 'absolute',
            top: size * 0.35
          }} />
          <View style={{ 
            width: size * 0.35, 
            height: 1.5, 
            backgroundColor: color,
            position: 'absolute',
            top: size * 0.45
          }} />
        </View>
      ),
      'settings-outline': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: size * 0.7, 
            height: size * 0.7, 
            borderWidth: 2, 
            borderColor: color,
            backgroundColor: 'transparent',
            borderRadius: size * 0.35
          }} />
          <View style={{ 
            width: size * 0.3, 
            height: size * 0.3, 
            borderRadius: size * 0.15,
            backgroundColor: color,
            position: 'absolute'
          }} />
        </View>
      ),
      'chevron-down': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: size * 0.8, color, fontWeight: 'bold' }}>▼</Text>
        </View>
      ),
      'chevron-forward': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: size * 0.8, color, fontWeight: 'bold' }}>▶</Text>
        </View>
      ),
      'construct': (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: size * 0.8, 
            height: 3, 
            backgroundColor: color,
            transform: [{ rotate: '45deg' }]
          }} />
          <View style={{ 
            width: size * 0.8, 
            height: 3, 
            backgroundColor: color,
            transform: [{ rotate: '-45deg' }],
            position: 'absolute'
          }} />
        </View>
      ),
    };

    return shapes[iconName] || (
      <Text style={{ fontSize: size * 0.8, color, textAlign: 'center', fontWeight: '600' }}>
        {IconMap[iconName] || '◯'}
      </Text>
    );
  };

  return (
    <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
      {getIconShape(name)}
    </View>
  );
};

interface SubMenuItem {
  id: string;
  name: string;
  icon: string;
  route: string;
}

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  route?: string;
  subItems?: SubMenuItem[];
}

const baseMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'grid-outline',
    route: '/',
  },
  {
    id: 'projects',
    name: 'Proyek',
    icon: 'briefcase-outline',
    subItems: [
      { id: 'project-list', name: 'Daftar Proyek', icon: 'list-outline', route: '/project/management' },
      { id: 'project-tasks', name: 'Tugas', icon: 'checkbox-outline', route: '/project/tasks' },
      { id: 'project-timeline', name: 'Timeline', icon: 'time-outline', route: '/project/timeline' },
    ],
  },
  {
    id: 'workers',
    name: 'Pekerja',
    icon: 'people-outline',
    subItems: [
      { id: 'worker-list', name: 'Daftar Pekerja', icon: 'person-outline', route: '/worker/management' },
      { id: 'worker-attendance', name: 'Absensi', icon: 'calendar-outline', route: '/worker/attendance' },
      { id: 'worker-performance', name: 'Kinerja', icon: 'trending-up-outline', route: '/worker/performance' },
    ],
  },
  {
    id: 'materials',
    name: 'Material',
    icon: 'cube-outline',
    subItems: [
      { id: 'material-stock', name: 'Stok Material', icon: 'layers-outline', route: '/material/stock' },
      { id: 'material-procurement', name: 'Pengadaan', icon: 'cart-outline', route: '/material/procurement' },
      { id: 'material-usage', name: 'Pemakaian', icon: 'arrow-down-outline', route: '/material/usage' },
    ],
  },
  {
    id: 'payroll',
    name: 'Keuangan',
    icon: 'card-outline',
    subItems: [
      { id: 'payroll-management', name: 'Penggajian', icon: 'wallet-outline', route: '/payroll/management' },
      { id: 'payroll-costs', name: 'Biaya Proyek', icon: 'receipt-outline', route: '/payroll/costs' },
      { id: 'payroll-reports', name: 'Laporan Keuangan', icon: 'bar-chart-outline', route: '/payroll/reports' },
    ],
  },
  {
    id: 'reports',
    name: 'Laporan',
    icon: 'document-text-outline',
    subItems: [
      { id: 'daily-reports', name: 'Laporan Harian', icon: 'today-outline', route: '/report/daily' },
      { id: 'weekly-reports', name: 'Laporan Mingguan', icon: 'calendar-outline', route: '/report/weekly' },
      { id: 'monthly-reports', name: 'Laporan Bulanan', icon: 'stats-chart-outline', route: '/report/monthly' },
    ],
  },
  {
    id: 'settings',
    name: 'Pengaturan',
    icon: 'settings-outline',
    route: '/settings',
  },
];

// Merge provided NAV items with existing base menu, avoiding duplicates by id (NAV first)
const useMenuItems = (navNodes?: NavNode[]): MenuItem[] => {
  return useMemo(() => {
    const navItems: MenuItem[] = (navNodes ?? []).map((n) => ({
      id: n.id,
      name: n.label,
      icon: n.id === 'settings' ? 'settings-outline' : 'grid-outline',
      route: n.path,
    }));

    if (!navItems.length) return baseMenuItems;

    const idsFromNav = new Set(navItems.map((m) => m.id));
    const filteredBase = baseMenuItems.filter((m) => !idsFromNav.has(m.id));
    return [...navItems, ...filteredBase];
  }, [navNodes]);
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  items?: NavNode[];
}

export default function Sidebar({ collapsed = false, onToggle, items }: SidebarProps) {
  const menuItems = useMenuItems(items);
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['projects']);

  const toggleExpanded = (itemId: string) => {
    if (collapsed) return;
    
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveRoute = (route: string) => pathname === route || pathname.startsWith(route);

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.route ? isActiveRoute(item.route) : false;

    const button = (
        <TouchableOpacity
          style={[
            styles.menuButton,
            isActive && styles.activeMenuButton,
            collapsed && styles.collapsedMenuButton,
          ]}
          onPress={() => {
            if (hasSubItems) {
              toggleExpanded(item.id);
            }
          }}
          activeOpacity={0.7}
          accessibilityLabel={collapsed ? item.name : undefined}
        >
          <View style={styles.menuButtonContent}>
            <ProfessionalIcon
              name={item.icon}
              size={collapsed ? 22 : 20}
              color={isActive ? '#fff' : '#64748b'}
            />
            {!collapsed && (
              <>
                <Text style={[styles.menuText, isActive && styles.activeMenuText]}>
                  {item.name}
                </Text>
                {hasSubItems && (
                  <ProfessionalIcon
                    name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={16}
                    color={isActive ? '#fff' : '#64748b'}
                    style={styles.chevronIcon}
                  />
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
    );
    return (
      <View key={item.id} style={styles.menuItem}>
        {item.route && !hasSubItems ? (
          <Link href={item.route} asChild>
            {button}
          </Link>
        ) : (
          button
        )}

        {hasSubItems && isExpanded && !collapsed && (
          <View style={styles.subMenu}>
            {item.subItems!.map((subItem) => {
              const isSubActive = isActiveRoute(subItem.route);
              return (
                <Link key={subItem.id} href={subItem.route} asChild>
                  <TouchableOpacity
                    style={[
                      styles.subMenuItem,
                      isSubActive && styles.activeSubMenuItem,
                    ]}
                    activeOpacity={0.7}
                  >
                    <ProfessionalIcon
                      name={subItem.icon}
                      size={16}
                      color={isSubActive ? '#3b82f6' : '#94a3b8'}
                    />
                    <Text style={[
                      styles.subMenuText,
                      isSubActive && styles.activeSubMenuText,
                    ]}>
                      {subItem.name}
                    </Text>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      collapsed && styles.collapsedContainer,
    ]}>
      {/* Header */}
      <View style={styles.header}>
        {!collapsed && (
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <ProfessionalIcon name="construct" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>MandorPro</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.toggleButton, collapsed && styles.collapsedToggleButton]}
          onPress={onToggle}
        >
          <ProfessionalIcon
            name={collapsed ? 'menu-outline' : 'chevron-down'}
            size={20}
            color="#64748b"
          />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={[styles.userProfile, collapsed && styles.collapsedUserProfile]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          {!collapsed && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Mandor</Text>
              <Text style={styles.userRole}>Administrator</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    width: 280,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  collapsedContainer: {
    width: 72,
  },
  mobileContainer: {
    width: '100%',
    maxWidth: 280,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: '4px 0 12px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  tabletContainer: {
    width: 220,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
  collapsedToggleButton: {
    alignSelf: 'center',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    marginBottom: 2,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  collapsedMenuButton: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  activeMenuButton: {
    backgroundColor: '#3b82f6',
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginLeft: 12,
    flex: 1,
  },
  activeMenuText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  subMenu: {
    marginLeft: 32,
    marginTop: 4,
    marginBottom: 8,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 1,
  },
  activeSubMenuItem: {
    backgroundColor: '#eff6ff',
  },
  subMenuText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 12,
    fontWeight: '500',
  },
  activeSubMenuText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapsedUserProfile: {
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  userRole: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
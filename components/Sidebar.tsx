import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import type { NavNode } from "../src/data/navTree";
import { Icon } from "@/src/ui/Icon";
import { sx } from "@/src/lib/sx";
import { colors, sidebar as SB } from "@/src/ui/tokens";

// Professional icon mapping using Unicode symbols (fallback)
const IconMap: { [key: string]: string } = {
  "menu-outline": "≡",
  "grid-outline": "▣",
  "briefcase-outline": "■",
  "people-outline": "👥",
  "cube-outline": "□",
  "card-outline": "◈",
  "document-text-outline": "◉",
  "settings-outline": "⚙",
  "list-outline": "☰",
  "checkbox-outline": "☑",
  "time-outline": "◷",
  "person-outline": "◑",
  "calendar-outline": "◫",
  "clipboard-outline": "◪",
  "receipt-outline": "◒",
  "calculator-outline": "◐",
  "analytics-outline": "◈",
  "chevron-down": "▼",
  "chevron-forward": "▶",
  construct: "⚒",
};

// Professional icon component with geometric shapes (fallback)
const ProfessionalIcon = ({
  name,
  size = 20,
  color = "#64748b",
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}) => {
  const getIconShape = (iconName: string) => {
    const shapes: { [key: string]: React.ReactElement } = {
      "menu-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.8,
              height: 2,
              backgroundColor: color,
              marginBottom: 3,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: size * 0.8,
              height: 2,
              backgroundColor: color,
              marginBottom: 3,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: size * 0.8,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        </View>
      ),
      "grid-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: size * 0.35,
                height: size * 0.35,
                backgroundColor: color,
                marginRight: 3,
                marginBottom: 3,
                borderRadius: 2,
              }}
            />
            <View
              style={{
                width: size * 0.35,
                height: size * 0.35,
                backgroundColor: color,
                marginBottom: 3,
                borderRadius: 2,
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: size * 0.35,
                height: size * 0.35,
                backgroundColor: color,
                marginRight: 3,
                borderRadius: 2,
              }}
            />
            <View
              style={{
                width: size * 0.35,
                height: size * 0.35,
                backgroundColor: color,
                borderRadius: 2,
              }}
            />
          </View>
        </View>
      ),
      "briefcase-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.8,
              height: size * 0.6,
              borderWidth: 2,
              borderColor: color,
              backgroundColor: "transparent",
              borderRadius: 3,
            }}
          />
          <View
            style={{
              width: size * 0.4,
              height: 4,
              backgroundColor: color,
              position: "absolute",
              top: size * 0.15,
              borderRadius: 2,
            }}
          />
        </View>
      ),
      "people-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: size * 0.28,
                height: size * 0.28,
                borderRadius: size * 0.14,
                borderWidth: 1.5,
                borderColor: color,
                backgroundColor: "transparent",
                marginRight: 3,
              }}
            />
            <View
              style={{
                width: size * 0.28,
                height: size * 0.28,
                borderRadius: size * 0.14,
                borderWidth: 1.5,
                borderColor: color,
                backgroundColor: "transparent",
              }}
            />
          </View>
          <View
            style={{
              width: size * 0.65,
              height: size * 0.3,
              borderWidth: 1.5,
              borderColor: color,
              backgroundColor: "transparent",
              borderTopLeftRadius: size * 0.15,
              borderTopRightRadius: size * 0.15,
              marginTop: 3,
            }}
          />
        </View>
      ),
      "cube-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderWidth: 2,
              borderColor: color,
              backgroundColor: "transparent",
              borderRadius: 3,
              transform: [{ rotate: "45deg" }],
            }}
          />
        </View>
      ),
      "card-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.8,
              height: size * 0.55,
              borderWidth: 2,
              borderColor: color,
              backgroundColor: "transparent",
              borderRadius: 4,
            }}
          />
          <View
            style={{
              width: size * 0.6,
              height: 2,
              backgroundColor: color,
              position: "absolute",
              top: size * 0.45,
            }}
          />
        </View>
      ),
      "document-text-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.65,
              height: size * 0.8,
              borderWidth: 2,
              borderColor: color,
              backgroundColor: "transparent",
              borderRadius: 2,
            }}
          />
          <View
            style={{
              width: size * 0.45,
              height: 1.5,
              backgroundColor: color,
              position: "absolute",
              top: size * 0.35,
            }}
          />
          <View
            style={{
              width: size * 0.35,
              height: 1.5,
              backgroundColor: color,
              position: "absolute",
              top: size * 0.45,
            }}
          />
        </View>
      ),
      "settings-outline": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.7,
              height: size * 0.7,
              borderWidth: 2,
              borderColor: color,
              backgroundColor: "transparent",
              borderRadius: size * 0.35,
            }}
          />
          <View
            style={{
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.15,
              backgroundColor: color,
              position: "absolute",
            }}
          />
        </View>
      ),
      "chevron-down": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: size * 0.8, color, fontWeight: "bold" }}>
            ▼
          </Text>
        </View>
      ),
      "chevron-forward": (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: size * 0.8, color, fontWeight: "bold" }}>
            ▶
          </Text>
        </View>
      ),
      construct: (
        <View
          style={{
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: size * 0.8,
              height: 3,
              backgroundColor: color,
              transform: [{ rotate: "45deg" }],
            }}
          />
          <View
            style={{
              width: size * 0.8,
              height: 3,
              backgroundColor: color,
              transform: [{ rotate: "-45deg" }],
              position: "absolute",
            }}
          />
        </View>
      ),
    };

    return (
      shapes[iconName] || (
        <Text
          style={{
            fontSize: size * 0.8,
            color,
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {IconMap[iconName] || "◯"}
        </Text>
      )
    );
  };

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
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
    id: "dashboard",
    name: "Dashboard",
    icon: "grid-outline",
    route: "/dashboard",
  },
  {
    id: "project",
    name: "Proyek",
    icon: "briefcase-outline",
    subItems: [
      {
        id: "project-list",
        name: "Daftar Proyek",
        icon: "list-outline",
        route: "/project/management",
      },
      {
        id: "project-tasks",
        name: "Tugas",
        icon: "checkbox-outline",
        route: "/project/tasks",
      },
      {
        id: "project-timeline",
        name: "Timeline",
        icon: "time-outline",
        route: "/project/timeline",
      },
    ],
  },
  {
    id: "worker",
    name: "Pekerja",
    icon: "people-outline",
    subItems: [
      {
        id: "worker-list",
        name: "Daftar Pekerja",
        icon: "person-outline",
        route: "/worker/management",
      },
      {
        id: "worker-attendance",
        name: "Absensi",
        icon: "calendar-outline",
        route: "/worker/attendance",
      },
      {
        id: "worker-performance",
        name: "Kinerja",
        icon: "trending-up-outline",
        route: "/worker/performance",
      },
    ],
  },
  {
    id: "material",
    name: "Material",
    icon: "cube-outline",
    subItems: [
      {
        id: "material-stock",
        name: "Stok Material",
        icon: "layers-outline",
        route: "/material/stock",
      },
      {
        id: "material-procurement",
        name: "Pengadaan",
        icon: "cart-outline",
        route: "/material/procurement",
      },
      {
        id: "material-usage",
        name: "Pemakaian",
        icon: "arrow-down-outline",
        route: "/material/usage",
      },
    ],
  },
  {
    id: "payroll",
    name: "Keuangan",
    icon: "card-outline",
    subItems: [
      {
        id: "payroll-management",
        name: "Penggajian",
        icon: "wallet-outline",
        route: "/payroll/management",
      },
      {
        id: "payroll-costs",
        name: "Biaya Proyek",
        icon: "receipt-outline",
        route: "/payroll/costs",
      },
      {
        id: "payroll-reports",
        name: "Laporan Keuangan",
        icon: "bar-chart-outline",
        route: "/payroll/reports",
      },
    ],
  },
  {
    id: "report",
    name: "Laporan",
    icon: "document-text-outline",
    subItems: [
      {
        id: "daily-reports",
        name: "Laporan Harian",
        icon: "today-outline",
        route: "/report/daily",
      },
      {
        id: "weekly-reports",
        name: "Laporan Mingguan",
        icon: "calendar-outline",
        route: "/report/weekly",
      },
      {
        id: "monthly-reports",
        name: "Laporan Bulanan",
        icon: "stats-chart-outline",
        route: "/report/monthly",
      },
    ],
  },
  {
    id: "settings",
    name: "Pengaturan",
    icon: "settings-outline",
    route: "/settings",
  },
  {
    id: "admin",
    name: "Admin",
    icon: "construct",
    subItems: [
      {
        id: "admin-db",
        name: "Database",
        icon: "document-text-outline",
        route: "/admin/database",
      },
    ],
  },
];

// Merge provided NAV items with existing base menu, avoiding duplicates by id (NAV first)
const useMenuItems = (navNodes?: NavNode[]): MenuItem[] => {
  return useMemo(() => {
    const navItems: MenuItem[] = (navNodes ?? []).map((n) => ({
      id: n.id,
      name: n.label,
      icon:
        n.icon || (n.id === "settings" ? "settings-outline" : "grid-outline"),
      route: n.route,
      subItems: n.tabs?.map((t) => ({
        id: `${n.id}-${t.id}`,
        name: t.label,
        icon: "list-outline",
        route: t.route,
      })) as any,
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

export default function Sidebar({
  collapsed = false,
  onToggle,
  items,
}: SidebarProps) {
  const menuItems = useMenuItems(items);
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(["project"]);

  const toggleExpanded = (itemId: string) => {
    if (collapsed) return;

    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveRoute = (route: string) => {
    // Normalize dashboard route: treat '/' and '/dashboard' as equivalent when checking active state
    if (route === "/" || route === "/dashboard") {
      return (
        pathname === "/" ||
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/")
      );
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = item.route ? isActiveRoute(item.route) : false;

    const button = (
      <Pressable
        style={sx(
          styles.menuButton,
          isActive && styles.activeMenuButton,
          collapsed && styles.collapsedMenuButton
        )}
        onPress={() => {
          if (hasSubItems) {
            toggleExpanded(item.id);
          } else if (item.route) {
            router.push(item.route);
          }
        }}
        accessibilityRole={item.route && !hasSubItems ? "link" : "button"}
        accessibilityLabel={collapsed ? item.name : undefined}
      >
        <View style={styles.menuButtonContent}>
          {/* Prefer Ionicons via Icon helper; fallback stays available below if needed */}
          <Icon
            name={item.icon}
            size={collapsed ? 22 : 20}
            color={isActive ? "#fff" : "#64748b"}
          />
          {!collapsed && (
            <>
              <Text
                style={sx(styles.menuText, isActive && styles.activeMenuText)}
              >
                {item.name}
              </Text>
              {hasSubItems && (
                <Icon
                  name={isExpanded ? "chevron-down" : "chevron-forward"}
                  size={16}
                  color={isActive ? "#fff" : "#64748b"}
                />
              )}
            </>
          )}
        </View>
      </Pressable>
    );
    return (
      <View key={item.id} style={styles.menuItem}>
        {button}

        {hasSubItems && isExpanded && !collapsed && (
          <View style={styles.subMenu}>
            {item.subItems!.map((subItem) => {
              const isSubActive = isActiveRoute(subItem.route);
              return (
                <Pressable
                  key={subItem.id}
                  style={sx(
                    styles.subMenuItem,
                    isSubActive && styles.activeSubMenuItem
                  )}
                  accessibilityRole="link"
                  onPress={() => router.push(subItem.route)}
                >
                  <Icon
                    name={subItem.icon}
                    size={16}
                    color={isSubActive ? colors.primary : colors.iconMuted}
                  />
                  <Text
                    style={sx(
                      styles.subMenuText,
                      isSubActive && styles.activeSubMenuText
                    )}
                  >
                    {subItem.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={sx(styles.container, collapsed && styles.collapsedContainer)}>
      {/* Header */}
      <View style={styles.header}>
        {!collapsed && (
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <ProfessionalIcon
                name="construct"
                size={24}
                color={colors.primaryOn}
              />
            </View>
            <Text style={styles.logoText}>MandorPro</Text>
          </View>
        )}
        <Pressable
          style={sx(
            styles.toggleButton,
            collapsed && styles.collapsedToggleButton
          )}
          onPress={onToggle}
          accessibilityRole="button"
        >
          <ProfessionalIcon
            name={collapsed ? "menu-outline" : "chevron-down"}
            size={20}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuSection}>{menuItems.map(renderMenuItem)}</View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View
          style={sx(
            styles.userProfile,
            collapsed && styles.collapsedUserProfile
          )}
        >
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
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.borderStrong,
    width: SB.drawerWidth,
    height: "100%",
    ...Platform.select({
      web: { boxShadow: "2px 0 10px rgba(0,0,0,0.05)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
      },
    }),
  },
  collapsedContainer: {
    width: SB.railWidth,
  },
  mobileContainer: {
    width: "100%",
    maxWidth: 280,
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
      },
      default: {
        shadowColor: "#000",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.page,
  },
  collapsedToggleButton: {
    alignSelf: "center",
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  collapsedMenuButton: {
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  activeMenuButton: {
    backgroundColor: colors.primary,
  },
  menuButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  activeMenuText: {
    color: colors.primaryOn,
    fontWeight: "600",
  },
  chevronIcon: {
    marginLeft: "auto",
  },
  subMenu: {
    marginLeft: 32,
    marginTop: 4,
    marginBottom: 8,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 1,
  },
  activeSubMenuItem: {
    backgroundColor: colors.primarySoft,
  },
  subMenuText: {
    fontSize: 13,
    color: colors.textMuted,
    marginLeft: 12,
    fontWeight: "500",
  },
  activeSubMenuText: {
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    padding: 16,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  collapsedUserProfile: {
    justifyContent: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.primaryOn,
    fontSize: 14,
    fontWeight: "600",
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  userRole: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

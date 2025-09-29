import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Map custom semantic names to Ionicons glyphs
const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  // Semantic names used by NAV_TREE (extend as needed)
  'layout-dashboard': 'speedometer-outline',
  settings: 'settings-outline',
  users: 'people-outline',
  wallet: 'wallet-outline',
  package: 'cube-outline',
  'folder-kanban': 'folder-outline',
  'file-chart': 'bar-chart-outline',
  'file-text': 'document-text-outline',
  'calendar-check': 'calendar-outline',
  'calendar-number': 'calendar-outline',
  notebook: 'book-outline',
  shield: 'shield-outline',
};

export function Icon({
  name,
  size = 18,
  color = '#334155',
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  // Prefer direct Ionicons name if it exists, otherwise use our mapping, else fallback
  const resolved: keyof typeof Ionicons.glyphMap =
    (name as keyof typeof Ionicons.glyphMap) in Ionicons.glyphMap
      ? (name as keyof typeof Ionicons.glyphMap)
      : iconMap[name] ?? 'ellipse-outline';

  return <Ionicons name={resolved} size={size} color={color} />;
}

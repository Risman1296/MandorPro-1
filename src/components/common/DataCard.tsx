// 📁 src/components/common/DataCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ConstructionTheme } from '@/src/constants/Theme';

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon?: string;
  onPress?: () => void;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  onPress,
  variant = 'default',
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: ConstructionTheme.colors.surface,
      padding: ConstructionTheme.spacing.lg,
      borderRadius: ConstructionTheme.borderRadius.lg,
      ...ConstructionTheme.shadows.sm,
    };

    switch (variant) {
      case 'highlight':
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: ConstructionTheme.colors.primary,
        };
      case 'warning':
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: ConstructionTheme.colors.warning,
        };
      case 'success':
        return {
          ...baseStyle,
          borderLeftWidth: 4,
          borderLeftColor: ConstructionTheme.colors.success,
        };
      default:
        return baseStyle;
    }
  };

  const CardContent = (
    <View style={getCardStyle()}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      
      <Text style={styles.value}>{value}</Text>
      
      {(subtitle || trend) && (
        <View style={styles.footer}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {trend && (
            <Text style={[
              styles.trend,
              { color: trend.isPositive ? ConstructionTheme.colors.success : ConstructionTheme.colors.danger }
            ]}>
              {trend.isPositive ? '↗ +' : '↘ '}{Math.abs(trend.value)}%
            </Text>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ConstructionTheme.spacing.sm,
  },
  title: {
    ...ConstructionTheme.typography.caption,
    color: ConstructionTheme.colors.medium,
    flex: 1,
  },
  icon: {
    fontSize: 16,
  },
  value: {
    ...ConstructionTheme.typography.h2,
    color: ConstructionTheme.colors.dark,
    marginBottom: ConstructionTheme.spacing.xs,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    ...ConstructionTheme.typography.small,
    color: ConstructionTheme.colors.medium,
    flex: 1,
  },
  trend: {
    ...ConstructionTheme.typography.small,
    fontWeight: '600',
  },
});

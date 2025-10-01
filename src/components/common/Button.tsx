// 📁 src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ConstructionTheme } from '@/src/constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: ConstructionTheme.borderRadius.md,
      paddingHorizontal: ConstructionTheme.spacing[size === 'sm' ? 'md' : 'lg'],
      paddingVertical: size === 'sm' ? ConstructionTheme.spacing.sm : ConstructionTheme.spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      width: fullWidth ? '100%' : undefined,
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: ConstructionTheme.colors.primary,
          ...ConstructionTheme.shadows.sm,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: ConstructionTheme.colors.secondary,
          ...ConstructionTheme.shadows.sm,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: ConstructionTheme.colors.primary,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: ConstructionTheme.colors.danger,
          ...ConstructionTheme.shadows.sm,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      fontWeight: '600' as const,
      marginLeft: icon ? ConstructionTheme.spacing.sm : 0,
    };

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          color: ConstructionTheme.colors.primary,
        };
      default:
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? ConstructionTheme.colors.primary : '#FFFFFF'} 
        />
      ) : (
        <>
          {icon && <Text style={{ fontSize: size === 'sm' ? 14 : 16 }}>{icon}</Text>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});

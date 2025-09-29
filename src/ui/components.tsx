import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacityProps,
} from 'react-native';
import { cardShadow, buttonShadow } from '@/src/ui/shadows';

// Button Component
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'medium', 
  style, 
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        style,
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Card Component
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = 16 }: CardProps) {
  return (
    <View style={[styles.card, cardShadow, { padding }, style]}>
      {children}
    </View>
  );
}

// Input Component
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ 
  label, 
  error, 
  style, 
  containerStyle, 
  ...props 
}: InputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  height = 8,
  color = '#10b981',
  backgroundColor = '#e5e7eb',
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <View 
      style={[
        styles.progressContainer, 
        { height, backgroundColor }, 
        style
      ]}
    >
      <View
        style={[
          styles.progressBar,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

// Status Badge Component
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info';
  text: string;
  style?: ViewStyle;
}

export function StatusBadge({ status, text, style }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, styles[`badge_${status}`], style]}>
      <Text style={[styles.badgeText, styles[`badgeText_${status}`]]}>
        {text}
      </Text>
    </View>
  );
}

// Number Input Component
interface NumberInputProps extends Omit<InputProps, 'keyboardType' | 'value' | 'onChangeText'> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  ...props
}: NumberInputProps) {
  const handleTextChange = (text: string) => {
    const numValue = parseFloat(text) || 0;
    let newValue = numValue;
    
    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);
    
    onValueChange(newValue);
  };

  return (
    <Input
      {...props}
      value={value.toString()}
      onChangeText={handleTextChange}
      keyboardType="numeric"
    />
  );
}

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionHeader({ title, subtitle, style }: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// List Item Component
interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  rightText?: string;
  rightComponent?: React.ReactNode;
}

export function ListItem({ 
  title, 
  subtitle, 
  rightText, 
  rightComponent, 
  style, 
  ...props 
}: ListItemProps) {
  return (
    <TouchableOpacity style={[styles.listItem, style]} {...props}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.listItemSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.listItemRight}>
        {rightText && <Text style={styles.listItemRightText}>{rightText}</Text>}
        {rightComponent}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Button styles
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_primary: {
    backgroundColor: '#3b82f6',
  },
  button_secondary: {
    backgroundColor: '#6b7280',
  },
  button_success: {
    backgroundColor: '#10b981',
  },
  button_warning: {
    backgroundColor: '#f59e0b',
  },
  button_danger: {
    backgroundColor: '#ef4444',
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  buttonText_primary: {
    color: '#ffffff',
  },
  buttonText_secondary: {
    color: '#ffffff',
  },
  buttonText_success: {
    color: '#ffffff',
  },
  buttonText_warning: {
    color: '#ffffff',
  },
  buttonText_danger: {
    color: '#ffffff',
  },

  // Card styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 4,
  },

  // Input styles
  inputContainer: {
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },

  // Progress bar styles
  progressContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },

  // Badge styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badge_success: {
    backgroundColor: '#dcfce7',
  },
  badge_warning: {
    backgroundColor: '#fef3c7',
  },
  badge_danger: {
    backgroundColor: '#fee2e2',
  },
  badge_info: {
    backgroundColor: '#dbeafe',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeText_success: {
    color: '#16a34a',
  },
  badgeText_warning: {
    color: '#d97706',
  },
  badgeText_danger: {
    color: '#dc2626',
  },
  badgeText_info: {
    color: '#2563eb',
  },

  // Section header styles
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },

  // List item styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  listItemRightText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
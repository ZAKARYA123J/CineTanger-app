import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CinetangerColors, CinetangerBorderRadius, CinetangerSpacing, CinetangerShadows } from '@/constants/theme';

interface CinetangerButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const CinetangerButton: React.FC<CinetangerButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, styles.disabled];
    }
    
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primary];
      case 'secondary':
        return [styles.button, styles.secondary];
      case 'outline':
        return [styles.button, styles.outline];
      default:
        return styles.button;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.text, styles.outlineText];
      default:
        return styles.text;
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
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: CinetangerSpacing.md,
    paddingHorizontal: CinetangerSpacing.lg,
    borderRadius: CinetangerBorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...CinetangerShadows.sm,
  },
  primary: {
    backgroundColor: CinetangerColors.primary,
  },
  secondary: {
    backgroundColor: CinetangerColors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: CinetangerColors.primary,
  },
  disabled: {
    backgroundColor: CinetangerColors.text.muted,
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: CinetangerColors.primary,
  },
});
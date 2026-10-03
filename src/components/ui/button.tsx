import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { ButtonStyles, Fonts, Radius, Spacing, Typography } from '@/constants/theme';

export type ButtonVariant = keyof typeof ButtonStyles;

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
};

export function Button({ label, variant = 'primary', disabled, style, ...props }: ButtonProps) {
  const colors = ButtonStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.backgroundColor },
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}
    >
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: Radius.small,
    paddingHorizontal: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: ButtonStyles.outline.textColor,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: Typography.label.fontWeight,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.82 },
});

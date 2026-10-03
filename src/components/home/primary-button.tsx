import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, style, disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && !disabled && styles.pressed, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.five, borderRadius: Radius.pill, backgroundColor: Palette.primary },
  label: { color: '#FFFFFF', fontFamily: Fonts.sans, fontSize: 14, fontWeight: '700' },
  arrow: { marginLeft: Spacing.three, color: '#FFFFFF', fontSize: 19, lineHeight: 22 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  disabled: { backgroundColor: '#A8B7B1' },
});

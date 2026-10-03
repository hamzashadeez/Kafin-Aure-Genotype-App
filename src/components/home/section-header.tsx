import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Text style={styles.actionArrow}>→</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.three, marginBottom: Spacing.three },
  textBlock: { flex: 1 },
  title: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 19, lineHeight: 25, fontWeight: '700' },
  subtitle: { marginTop: 3, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 19 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: Spacing.two, paddingLeft: Spacing.two },
  actionText: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700' },
  actionArrow: { color: Palette.primary, fontSize: 16 },
});

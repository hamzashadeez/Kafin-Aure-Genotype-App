import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  description: string;
  cta: string;
  icon: ComponentProps<typeof SymbolView>['name'];
  onPress: () => void;
};

export function EducationalCard({ title, description, cta, icon, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <SymbolView name={icon} tintColor={Palette.primary} size={21} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.ctaRow}>
          <Text style={styles.cta}>{cta}</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three, padding: Spacing.four, borderRadius: Radius.card, borderWidth: 1, borderColor: '#EAEDE6', backgroundColor: Palette.surface },
  iconWrap: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  copy: { flex: 1 },
  title: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 14, lineHeight: 19, fontWeight: '700' },
  description: { marginTop: 4, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.two },
  cta: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '700' },
  arrow: { color: Palette.primary, fontSize: 15 },
  pressed: { opacity: 0.78 },
});

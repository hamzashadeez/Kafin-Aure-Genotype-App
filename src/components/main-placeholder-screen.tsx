import { SymbolView } from 'expo-symbols';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  description: string;
  icon: ComponentProps<typeof SymbolView>['name'];
  children?: ReactNode;
};

export function MainPlaceholderScreen({ title, description, icon, children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.brand}>SAN GENOTYPE</Text>
        <View style={styles.iconCard}>
          <SymbolView name={icon} tintColor={Palette.primary} size={34} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Wannan sashe yana nan tafe</Text>
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.seven },
  brand: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '800', letterSpacing: 1.7, marginBottom: Spacing.five },
  iconCard: { width: 76, height: 76, borderRadius: Radius.large, backgroundColor: Palette.greenSoft, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.five },
  title: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 30, lineHeight: 38, fontWeight: '800', textAlign: 'center' },
  description: { maxWidth: 320, marginTop: Spacing.two, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.six, paddingHorizontal: Spacing.four, paddingVertical: Spacing.two, borderRadius: Radius.pill, backgroundColor: Palette.surface },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.green },
  statusText: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '600' },
});

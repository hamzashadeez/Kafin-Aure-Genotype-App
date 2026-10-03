import { StyleSheet, View, type ViewProps } from 'react-native';

import { CardStyles, Shadows, Spacing } from '@/constants/theme';

export type CardProps = ViewProps & {
  padded?: boolean;
};

export function Card({ padded = true, style, ...props }: CardProps) {
  return <View style={[styles.card, padded && styles.padded, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CardStyles.backgroundColor,
    borderRadius: CardStyles.borderRadius,
    ...Shadows.card,
  },
  padded: {
    padding: Spacing.six,
  },
});

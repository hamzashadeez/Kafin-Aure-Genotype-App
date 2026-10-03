import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LessonCard } from '@/components/home/lesson-card';
import { Fonts, Palette, Spacing } from '@/constants/theme';
import { lessons } from '@/data/lessons';

export default function LessonsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>KOYI A HANKALI</Text>
            <Text accessibilityRole="header" style={styles.title}>Darussan</Text>
            <Text style={styles.subtitle}>Gajerun darussa cikin Hausa, a lokacin da ya dace da kai.</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.count}>{String(lessons.length).padStart(2, '0')}</Text>
            <Text style={styles.countLabel}>darussa</Text>
          </View>
        </View>

        <View style={styles.infoStrip}>
          <Text style={styles.infoMark}>i</Text>
          <Text style={styles.infoText}>Wannan bayani na ilimi ne; don shawarwari na kanka, tuntubi ƙwararre.</Text>
        </View>

        <View style={styles.lessonList}>
          {lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              number={index + 1}
              layout="vertical"
              onPress={() => router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: Spacing.five, paddingTop: Spacing.four, paddingBottom: Spacing.seven },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.four, marginBottom: Spacing.five },
  headingCopy: { flex: 1 },
  eyebrow: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  title: { marginTop: 5, color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 29, lineHeight: 36, fontWeight: '800' },
  subtitle: { maxWidth: 340, marginTop: 4, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 20 },
  countBadge: { minWidth: 62, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, alignItems: 'center', borderRadius: 17, backgroundColor: Palette.greenSoft },
  count: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 18, fontWeight: '800' },
  countLabel: { marginTop: 1, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 9, fontWeight: '600' },
  infoStrip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, marginBottom: Spacing.five, borderRadius: 15, backgroundColor: '#EFF2EA' },
  infoMark: { width: 22, height: 22, borderRadius: 11, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', color: Palette.primary, backgroundColor: '#DDEBDD', fontFamily: Fonts.sans, fontSize: 13, fontWeight: '800' },
  infoText: { flex: 1, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, lineHeight: 17 },
  lessonList: { gap: Spacing.three },
});

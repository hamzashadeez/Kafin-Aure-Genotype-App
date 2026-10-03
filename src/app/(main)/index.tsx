import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EducationalCard } from '@/components/home/educational-card';
import { LessonCard } from '@/components/home/lesson-card';
import { PrimaryButton } from '@/components/home/primary-button';
import { SectionHeader } from '@/components/home/section-header';
import { ONBOARDING_COMPLETE_KEY } from '@/constants/storage';
import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { educationalActions } from '@/data/home-content';
import { lessons } from '@/data/lessons';

const openLessons = () => router.navigate('/(main)/lessons');

export default function HomeScreen() {
  const continueLesson = lessons.find((lesson) => lesson.progress > 0 && !lesson.completed) ?? lessons[0];
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    } catch {
      // Keep the development shortcut usable in the current session.
    }
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brandEyebrow}>SAN GENOTYPE</Text>
              <Text accessibilityRole="header" style={styles.greeting}>Barka da zuwa.</Text>
              <Text style={styles.headerSubtitle}>Koyi. Saurara. Fahimta.</Text>
            </View>
            <View accessibilityLabel="San Genotype" accessibilityRole="image" style={styles.brandMark}>
              <Text style={styles.brandMarkText}>SG</Text>
            </View>
          </View>

          <View style={styles.introCard}>
            <View style={styles.introCopy}>
              <View style={styles.introLabelRow}>
                <View style={styles.introLabelDot} />
                <Text style={styles.introLabel}>ILIMI CIKIN HAUSA</Text>
              </View>
              <Text style={styles.introTitle}>Fahimci genotype, a lokacinka.</Text>
              <Text style={styles.introBody}>
                Gajerun darussa masu sauƙin sauraro domin ƙara fahimta da wayar da kai.
              </Text>
              <PrimaryButton label="Fara koyo" onPress={openLessons} style={styles.introButton} />
            </View>
            <View pointerEvents="none" style={styles.introArt}>
              <View style={styles.artCircleLarge} />
              <View style={styles.artCircleSmall} />
              <View style={styles.artCard}>
                <View style={styles.artCardMark}><Text style={styles.artCardMarkText}>SG</Text></View>
                <View style={styles.artLineWide} />
                <View style={styles.artLineShort} />
                <View style={styles.artPlay}>
                  <SymbolView name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }} tintColor={Palette.primary} size={11} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Ci gaba da sauraro"
              subtitle="Ka koma inda ka tsaya"
              actionLabel="Duba darussa"
              onAction={openLessons}
            />
            <LessonCard lesson={continueLesson} number={lessons.indexOf(continueLesson) + 1} featured />
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Darussan"
              subtitle="Bincika batutuwa daban-daban"
              actionLabel="Duka"
              onAction={openLessons}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lessonList}>
              {lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} onPress={openLessons} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Karin sani" subtitle="Matakai masu sauƙi don ci gaba da koyo" />
            <View style={styles.educationalList}>
              {educationalActions.map((action) => (
                <EducationalCard
                  key={action.id}
                  title={action.title}
                  description={action.description}
                  cta={action.cta}
                  icon={action.icon}
                  onPress={action.id === 'informed-conversation' ? () => router.navigate('/(main)/about') : openLessons}
                />
              ))}
            </View>
          </View>

          {__DEV__ && (
            <Pressable onPress={resetOnboarding} style={styles.devReset}>
              <Text style={styles.devResetText}>Sake gwada onboarding (development)</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  scrollContent: { flexGrow: 1, paddingBottom: Spacing.five },
  page: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: Spacing.five },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.two, paddingBottom: Spacing.five },
  brandEyebrow: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  greeting: { marginTop: 6, color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 27, lineHeight: 34, fontWeight: '800' },
  headerSubtitle: { marginTop: 2, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 19 },
  brandMark: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  brandMarkText: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 14, fontWeight: '800', letterSpacing: 0.4 },
  introCard: { minHeight: 224, position: 'relative', overflow: 'hidden', flexDirection: 'row', alignItems: 'center', padding: Spacing.five, borderRadius: Radius.large, backgroundColor: '#EAF1E8' },
  introCopy: { zIndex: 1, width: '66%', alignItems: 'flex-start' },
  introLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: Spacing.two },
  introLabelDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.green },
  introLabel: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  introTitle: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 20, lineHeight: 26, fontWeight: '800' },
  introBody: { maxWidth: 270, marginTop: Spacing.two, color: '#546663', fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
  introButton: { minHeight: 42, marginTop: Spacing.four, paddingHorizontal: Spacing.four },
  introArt: { position: 'absolute', top: 0, right: 0, bottom: 0, width: '35%', alignItems: 'center', justifyContent: 'center' },
  artCircleLarge: { position: 'absolute', width: 172, height: 172, borderRadius: 86, right: -26, top: -8, backgroundColor: '#D7E7D8' },
  artCircleSmall: { position: 'absolute', width: 25, height: 25, borderRadius: 13, right: 19, bottom: 22, backgroundColor: '#EDC58A' },
  artCard: { width: 89, height: 117, borderRadius: 18, padding: 12, justifyContent: 'center', backgroundColor: Palette.surface, transform: [{ rotate: '7deg' }], shadowColor: '#193A35', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  artCardMark: { width: 29, height: 29, borderRadius: 10, marginBottom: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  artCardMarkText: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 9, fontWeight: '800' },
  artLineWide: { width: 58, height: 6, borderRadius: 4, backgroundColor: '#D8E2DB' },
  artLineShort: { width: 39, height: 5, borderRadius: 3, marginTop: 6, backgroundColor: '#E8ECE8' },
  artPlay: { width: 25, height: 25, borderRadius: 13, marginTop: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDEDE0' },
  section: { marginTop: Spacing.six },
  lessonList: { gap: Spacing.three, paddingRight: Spacing.five },
  educationalList: { gap: Spacing.three },
  devReset: { alignSelf: 'center', marginTop: Spacing.five, padding: Spacing.two },
  devResetText: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, textDecorationLine: 'underline' },
});

import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAudioPlayback } from '@/audio/use-audio-playback';
import { PrimaryButton } from '@/components/home/primary-button';
import { SectionHeader } from '@/components/home/section-header';
import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { formatLessonDuration, lessons, type LessonThumbnailIcon } from '@/data/lessons';
import type { ComponentProps } from 'react';
import { PLAYBACK_SPEEDS } from '@/audio/audio-playback-provider';

const iconNames: Record<LessonThumbnailIcon, ComponentProps<typeof SymbolView>['name']> = {
  book: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  layers: { ios: 'square.3.layers.3d', android: 'layers', web: 'layers' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  branch: { ios: 'arrow.triangle.branch', android: 'account_tree', web: 'account_tree' },
  chat: { ios: 'bubble.left.fill', android: 'chat_bubble', web: 'chat_bubble' },
};

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const audio = useAudioPlayback();
  const [seekWidth, setSeekWidth] = useState(0);
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Ba a sami darasin ba.</Text>
          <PrimaryButton label="Komawa darussa" onPress={() => router.replace('/(main)/lessons')} />
        </View>
      </SafeAreaView>
    );
  }

  const isActiveLesson = audio.lessonId === lesson.id;
  const playbackState = isActiveLesson ? audio.state : 'idle';
  const duration = isActiveLesson && audio.duration > 0 ? audio.duration : lesson.durationSeconds;
  const currentTime = isActiveLesson ? audio.currentTime : 0;
  const progress = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;
  const toggleAudio = () => {
    if (isActiveLesson && playbackState === 'error') audio.playLesson(lesson.id);
    else audio.togglePlayback(lesson.id);
  };
  const statusLabel = {
    idle: 'A shirye kake ka saurara?',
    loading: 'Ana lodin sauti…',
    playing: 'Ana sauraron darasi',
    paused: 'An dakatar da sauraro',
    finished: 'An gama sauraron darasi',
    error: 'An samu matsala wajen kunna sauti',
  }[playbackState];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Komawa darussa" onPress={() => router.back()} style={styles.backButton}>
          <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} tintColor={Palette.primaryDark} size={18} />
        </Pressable>
        <Text style={styles.topLabel}>DARASIN ILIMI</Text>
        <View style={styles.topSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.hero}>
            <View style={styles.heroGlow} />
            <View style={styles.heroIcon}>
              <SymbolView name={iconNames[lesson.thumbnailIcon]} tintColor="#E3F2E8" size={34} />
            </View>
            <View style={styles.durationPill}>
              <SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} tintColor="#D5E5DD" size={13} />
              <Text style={styles.durationText}>{formatLessonDuration(Math.floor(duration))}</Text>
            </View>
            <Text style={styles.lessonNumber}>DARASI {String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</Text>
          </View>

          <Text accessibilityRole="header" style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>{lesson.description}</Text>

          <View style={styles.playPanel}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playbackState === 'playing' ? 'Dakatar da sauraro' : 'Saurari darasin'}
              accessibilityState={{ disabled: playbackState === 'loading' }}
              disabled={playbackState === 'loading'}
              onPress={toggleAudio}
              style={({ pressed }) => [styles.largePlayButton, pressed && styles.playPressed]}>
              <SymbolView
                name={playbackState === 'playing' ? { ios: 'pause.fill', android: 'pause', web: 'pause' } : { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
                tintColor={Palette.primaryDark}
                size={27}
              />
            </Pressable>
            <Text style={styles.playPanelTitle}>{statusLabel}</Text>
            <Text style={styles.playPanelBody}>
              {playbackState === 'error' ? audio.error : 'Ana amfani da sautin gwaji na cikin app.'}
            </Text>
            {isActiveLesson && playbackState !== 'idle' && (
              <View style={styles.transport}>
                <Pressable accessibilityRole="button" accessibilityLabel="Koma baya da sakan 15" onPress={() => audio.seekBy(-15)} style={styles.skipControl}>
                  <Text style={styles.skipIcon}>↶</Text><Text style={styles.skipSeconds}>15</Text>
                </Pressable>
                <Text style={styles.timeReadout}>
                  {formatLessonDuration(Math.floor(currentTime))} / {formatLessonDuration(Math.floor(duration))}
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Matsa gaba da sakan 15" onPress={() => audio.seekBy(15)} style={styles.skipControl}>
                  <Text style={styles.skipIcon}>↷</Text><Text style={styles.skipSeconds}>15</Text>
                </Pressable>
              </View>
            )}
            {isActiveLesson && (
              <Pressable
                accessibilityRole="adjustable"
                accessibilityLabel="Matsayin sauti"
                accessibilityValue={{ min: 0, max: duration, now: currentTime }}
                accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
                onAccessibilityAction={({ nativeEvent }) => audio.seekBy(nativeEvent.actionName === 'increment' ? 15 : -15)}
                onLayout={(event) => setSeekWidth(event.nativeEvent.layout.width)}
                onPress={(event) => {
                  if (seekWidth > 0 && duration > 0) audio.seekTo((event.nativeEvent.locationX / seekWidth) * duration);
                }}
                style={styles.seekTrack}>
                <View style={styles.seekBase} />
                <View style={[styles.seekFill, { width: `${progress * 100}%` }]} />
                <View style={[styles.seekThumb, { left: `${progress * 100}%` }]} />
              </Pressable>
            )}
            {isActiveLesson && (
              <View style={styles.speedRow}>
                <Text style={styles.speedLabel}>Sauri:</Text>
                {PLAYBACK_SPEEDS.map((speed) => (
                  <Pressable
                    key={speed}
                    accessibilityRole="button"
                    accessibilityState={{ selected: audio.playbackRate === speed }}
                    onPress={() => audio.setPlaybackRate(speed)}
                    style={[styles.speedChip, audio.playbackRate === speed && styles.speedChipActive]}>
                    <Text style={[styles.speedText, audio.playbackRate === speed && styles.speedTextActive]}>{speed}×</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.learningSection}>
            <SectionHeader title="Abubuwan da za ka koya" subtitle="Mahimman batutuwan wannan darasi" />
            <View style={styles.pointList}>
              {lesson.keyLearningPoints.map((point, index) => (
                <View key={`${lesson.id}-point-${index}`} style={styles.pointRow}>
                  <View style={styles.pointCheck}>
                    <Text style={styles.pointNumber}>{String(index + 1).padStart(2, '0')}</Text>
                  </View>
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.notice}>
            <Text style={styles.noticeMark}>i</Text>
            <Text style={styles.noticeText}>Wannan darasi na ilimi ne. Don shawarwari na kanka, ka tuntubi ƙwararren da ya dace.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <PrimaryButton
          label="Buɗe mai kunna sauti"
          onPress={() => router.push({ pathname: '/player/[lessonId]', params: { lessonId: lesson.id } })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  topBar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.five },
  backButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.surface },
  topLabel: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  topSpacer: { width: 38 },
  scrollContent: { flexGrow: 1, paddingBottom: Spacing.five },
  page: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: Spacing.five },
  hero: { height: 156, overflow: 'hidden', position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.large, backgroundColor: Palette.primaryDark },
  heroGlow: { position: 'absolute', width: 210, height: 210, right: -46, top: -98, borderRadius: 105, backgroundColor: '#145B54' },
  heroIcon: { width: 82, height: 82, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.13)' },
  durationPill: { position: 'absolute', left: Spacing.four, bottom: Spacing.four, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: Radius.pill, backgroundColor: 'rgba(255,255,255,0.12)' },
  durationText: { color: '#E3F2E8', fontFamily: Fonts.sans, fontSize: 11, fontWeight: '700' },
  lessonNumber: { position: 'absolute', right: Spacing.four, bottom: Spacing.four, color: '#B5CDC4', fontFamily: Fonts.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { marginTop: Spacing.five, color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 27, lineHeight: 35, fontWeight: '800' },
  description: { marginTop: Spacing.two, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 14, lineHeight: 22 },
  playPanel: { alignItems: 'center', marginTop: Spacing.five, paddingVertical: Spacing.five, paddingHorizontal: Spacing.four, borderRadius: Radius.card, backgroundColor: '#EDF2EA' },
  largePlayButton: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', paddingLeft: 4, backgroundColor: '#D7E9D9' },
  playPanelTitle: { marginTop: Spacing.three, color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 15, fontWeight: '700' },
  playPanelBody: { marginTop: 4, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  playPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  transport: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.four },
  skipControl: { minWidth: 54, minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 14, backgroundColor: Palette.surface },
  skipIcon: { color: Palette.primary, fontSize: 20, fontWeight: '700' },
  skipSeconds: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '700' },
  timeReadout: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600' },
  seekTrack: { width: '100%', height: 20, justifyContent: 'center', marginTop: Spacing.two },
  seekBase: { position: 'absolute', left: 0, right: 0, height: 5, borderRadius: 3, backgroundColor: '#D5DED7' },
  seekFill: { position: 'absolute', left: 0, height: 5, borderRadius: 3, backgroundColor: Palette.primary },
  seekThumb: { position: 'absolute', width: 13, height: 13, marginLeft: -6, borderRadius: 7, backgroundColor: Palette.primary, borderWidth: 2, borderColor: '#FFFFFF' },
  speedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: Spacing.two },
  speedLabel: { marginRight: 2, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600' },
  speedChip: { minWidth: 44, paddingVertical: 7, alignItems: 'center', borderRadius: Radius.pill, backgroundColor: Palette.surface },
  speedChipActive: { backgroundColor: Palette.primary },
  speedText: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '700' },
  speedTextActive: { color: '#FFFFFF' },
  learningSection: { marginTop: Spacing.six },
  pointList: { gap: Spacing.three },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three, padding: Spacing.four, borderRadius: Radius.card, backgroundColor: Palette.surface },
  pointCheck: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  pointNumber: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 9, fontWeight: '800' },
  pointText: { flex: 1, paddingTop: 3, color: Palette.text, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 20 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginTop: Spacing.five, padding: Spacing.three, borderRadius: 15, backgroundColor: '#EFF2EA' },
  noticeMark: { width: 22, height: 22, borderRadius: 11, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', color: Palette.primary, backgroundColor: '#DDEBDD', fontFamily: Fonts.sans, fontSize: 13, fontWeight: '800' },
  noticeText: { flex: 1, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, lineHeight: 17 },
  bottomAction: { paddingHorizontal: Spacing.five, paddingTop: Spacing.three, paddingBottom: Spacing.two, backgroundColor: Palette.background, borderTopWidth: 1, borderTopColor: Palette.border },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.seven, gap: Spacing.four },
  notFoundTitle: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 22, fontWeight: '700' },
});

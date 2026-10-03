import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PLAYBACK_SPEEDS } from '@/audio/audio-playback-provider';
import { useAudioPlayback } from '@/audio/use-audio-playback';
import { Fonts, Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import { formatLessonDuration, lessons, type LessonThumbnailIcon } from '@/data/lessons';
import type { ComponentProps } from 'react';

const iconNames: Record<LessonThumbnailIcon, ComponentProps<typeof SymbolView>['name']> = {
  book: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  layers: { ios: 'square.3.layers.3d', android: 'layers', web: 'layers' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  branch: { ios: 'arrow.triangle.branch', android: 'account_tree', web: 'account_tree' },
  chat: { ios: 'bubble.left.fill', android: 'chat_bubble', web: 'chat_bubble' },
};

// Stable decorative waveform heights; playback progress colors the bars as audio advances.
const waveform = Array.from({ length: 59 }, (_, index) => {
  const shape = Math.abs(Math.sin(index * 1.71) * Math.cos(index * 0.37));
  return 9 + Math.round(shape * 30);
});

export default function AudioPlayerScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const audio = useAudioPlayback();
  const [waveformWidth, setWaveformWidth] = useState(0);
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.errorTitle}>Ba a sami darasin ba.</Text>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/(main)/lessons')} style={styles.backToLessons}>
            <Text style={styles.backToLessonsText}>Komawa darussa</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const active = audio.lessonId === lesson.id;
  const state = active ? audio.state : 'idle';
  const duration = active && audio.duration > 0 ? audio.duration : lesson.durationSeconds;
  const currentTime = active ? audio.currentTime : 0;
  const progress = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;
  const remaining = Math.max(0, duration - currentTime);
  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';
  const isFinished = state === 'finished';

  const toggle = () => {
    if (active && state === 'error') audio.playLesson(lesson.id);
    else audio.togglePlayback(lesson.id);
  };
  const seekAt = (locationX: number) => {
    if (active && waveformWidth > 0 && duration > 0) audio.seekTo((locationX / waveformWidth) * duration);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Komawa darasin" onPress={() => router.back()} style={styles.iconButton}>
          <SymbolView name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }} tintColor="#FFFFFF" size={19} />
        </Pressable>
        <Text style={styles.topTitle}>MAI KUNNA SAUTI</Text>
        <View style={styles.topRight}>
          <SymbolView name={{ ios: 'waveform', android: 'graphic_eq', web: 'graphic_eq' }} tintColor="#D0E6D8" size={19} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.artwork}>
          <View style={styles.orbOne} />
          <View style={styles.orbTwo} />
          <View style={styles.artworkTile}>
            <SymbolView name={iconNames[lesson.thumbnailIcon]} tintColor="#E2F2E7" size={58} />
          </View>
          <View style={styles.artworkTag}>
            <SymbolView name={{ ios: 'headphones', android: 'headphones', web: 'headphones' }} tintColor="#D2E7DA" size={15} />
            <Text style={styles.artworkTagText}>DARASI NA {String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.artworkDuration}>
            <Text style={styles.artworkDurationText}>{formatLessonDuration(Math.floor(duration))}</Text>
          </View>
        </View>

        <View style={styles.lessonInfo}>
          <Text style={styles.eyebrow}>SAN GENOTYPE • DARUSSAN SAUTI</Text>
          <Text accessibilityRole="header" style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
        </View>

        <View style={styles.waveformSection}>
          <Pressable
            accessibilityRole="adjustable"
            accessibilityLabel="Matsayin sautin darasi"
            accessibilityValue={{ min: 0, max: duration, now: currentTime }}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={({ nativeEvent }) => audio.seekBy(nativeEvent.actionName === 'increment' ? 15 : -15)}
            onLayout={(event) => setWaveformWidth(event.nativeEvent.layout.width)}
            onPress={(event) => seekAt(event.nativeEvent.locationX)}
            style={styles.waveform}>
            {waveform.map((height, index) => {
              const passed = (index + 0.5) / waveform.length <= progress;
              return <View key={index} style={[styles.waveBar, { height, backgroundColor: passed ? Palette.green : '#C8D7D0' }]} />;
            })}
            {waveformWidth > 0 && (
              <View pointerEvents="none" style={[styles.waveMarker, { left: `${progress * 100}%` }]} />
            )}
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={styles.elapsed}>{formatLessonDuration(Math.floor(currentTime))}</Text>
            <Text style={styles.remaining}>−{formatLessonDuration(Math.ceil(remaining))} / {formatLessonDuration(Math.floor(duration))}</Text>
          </View>
        </View>

        {state === 'error' && <Text accessibilityRole="alert" style={styles.errorMessage}>{audio.error ?? 'An samu matsala wajen kunna sauti.'}</Text>}

        <View style={styles.transport}>
          <Pressable accessibilityRole="button" accessibilityLabel="Koma baya da sakan 15" accessibilityState={{ disabled: !active }} disabled={!active} onPress={() => audio.seekBy(-15)} style={({ pressed }) => [styles.skipButton, !active && styles.inactiveControl, pressed && styles.pressed]}>
            <SymbolView name={{ ios: 'gobackward.15', android: 'fast_rewind', web: 'fast_rewind' }} tintColor={Palette.primaryDark} size={26} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Dakatar da sauraro' : isFinished ? 'Sake saurara' : 'Saurari darasin'}
            accessibilityState={{ disabled: isLoading }}
            disabled={isLoading}
            onPress={toggle}
            style={({ pressed }) => [styles.playButton, pressed && styles.playPressed, isLoading && styles.buttonLoading]}>
            <SymbolView
              name={isPlaying ? { ios: 'pause.fill', android: 'pause', web: 'pause' } : isFinished ? { ios: 'arrow.counterclockwise', android: 'replay', web: 'replay' } : { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
              tintColor="#FFFFFF"
              size={31}
            />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Matsa gaba da sakan 15" accessibilityState={{ disabled: !active }} disabled={!active} onPress={() => audio.seekBy(15)} style={({ pressed }) => [styles.skipButton, !active && styles.inactiveControl, pressed && styles.pressed]}>
            <SymbolView name={{ ios: 'goforward.15', android: 'fast_forward', web: 'fast_forward' }} tintColor={Palette.primaryDark} size={26} />
          </Pressable>
        </View>
        <Text style={styles.playStatus}>
          {isLoading ? 'Ana loda sauti…' : isPlaying ? 'Ana sauraron darasi' : isFinished ? 'An gama — taɓa don sake saurara' : state === 'error' ? 'Ba a iya kunna sautin ba' : 'Taɓa don fara sauraro'}
        </Text>

        <View style={styles.speedCard}>
          <View style={styles.speedTitleRow}>
            <Text style={styles.speedTitle}>Saurin sauraro</Text>
            <Text style={styles.speedCurrent}>{audio.playbackRate}×</Text>
          </View>
          <View style={styles.speedOptions}>
            {PLAYBACK_SPEEDS.map((speed) => {
              const selected = audio.playbackRate === speed;
              return (
                <Pressable
                  key={speed}
                  accessibilityRole="button"
                  accessibilityLabel={`Sauri ${speed}x`}
                  accessibilityState={{ selected }}
                  onPress={() => audio.setPlaybackRate(speed)}
                  style={({ pressed }) => [styles.speedOption, selected && styles.speedOptionActive, pressed && styles.pressed]}>
                  <Text style={[styles.speedOptionText, selected && styles.speedOptionTextActive]}>{speed}×</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.note}>
          <View style={styles.noteIcon}>
            <SymbolView name={{ ios: 'info', android: 'info', web: 'info' }} tintColor={Palette.primary} size={15} />
          </View>
          <Text style={styles.noteText}>Sautin gwaji ne na cikin app. Za a iya maye gurbinsa da rikodin darasi na gaba.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  topBar: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.five, backgroundColor: Palette.primaryDark },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  topTitle: { color: '#D6E5DD', fontFamily: Fonts.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  topRight: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  content: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: Spacing.five, paddingBottom: Spacing.seven },
  artwork: { height: 270, marginTop: Spacing.four, overflow: 'hidden', position: 'relative', alignItems: 'center', justifyContent: 'center', borderRadius: Radius.large, backgroundColor: Palette.primaryDark, ...Shadows.card },
  orbOne: { position: 'absolute', width: 250, height: 250, right: -65, top: -130, borderRadius: 125, backgroundColor: '#145B54' },
  orbTwo: { position: 'absolute', width: 190, height: 190, left: -95, bottom: -110, borderRadius: 95, backgroundColor: 'rgba(76,175,120,0.16)' },
  artworkTile: { width: 136, height: 136, alignItems: 'center', justifyContent: 'center', borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  artworkTag: { position: 'absolute', left: Spacing.four, bottom: Spacing.four, minHeight: 35, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, borderRadius: Radius.pill, backgroundColor: 'rgba(255,255,255,0.1)' },
  artworkTagText: { color: '#D8E7DE', fontFamily: Fonts.sans, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  artworkDuration: { position: 'absolute', right: Spacing.four, bottom: Spacing.four, paddingHorizontal: 11, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: 'rgba(255,255,255,0.1)' },
  artworkDurationText: { color: '#FFFFFF', fontFamily: Fonts.sans, fontSize: 11, fontWeight: '700' },
  lessonInfo: { alignItems: 'center', marginTop: Spacing.five },
  eyebrow: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 9, fontWeight: '800', letterSpacing: 1.3, textAlign: 'center' },
  lessonTitle: { marginTop: Spacing.two, color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 25, lineHeight: 33, fontWeight: '800', textAlign: 'center' },
  lessonDescription: { maxWidth: 440, marginTop: Spacing.two, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  waveformSection: { marginTop: Spacing.five, paddingHorizontal: Spacing.one },
  waveform: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2, overflow: 'hidden' },
  waveBar: { flex: 1, minWidth: 2, maxWidth: 5, borderRadius: 4 },
  waveMarker: { position: 'absolute', top: 2, bottom: 2, width: 2, marginLeft: -1, borderRadius: 2, backgroundColor: Palette.primaryDark },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.two },
  elapsed: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '800', fontVariant: ['tabular-nums'] },
  remaining: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600', fontVariant: ['tabular-nums'] },
  errorMessage: { marginTop: Spacing.three, color: Palette.error, fontFamily: Fonts.sans, fontSize: 12, textAlign: 'center' },
  transport: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.six, marginTop: Spacing.five },
  skipButton: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#E9EEE8' },
  inactiveControl: { opacity: 0.5 },
  playButton: { width: 78, height: 78, alignItems: 'center', justifyContent: 'center', paddingLeft: 3, borderRadius: 39, backgroundColor: Palette.primary, ...Shadows.card },
  playPressed: { opacity: 0.88, transform: [{ scale: 0.96 }] },
  buttonLoading: { opacity: 0.65 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.96 }] },
  playStatus: { minHeight: 20, marginTop: Spacing.two, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  speedCard: { marginTop: Spacing.four, padding: Spacing.four, borderRadius: Radius.card, backgroundColor: Palette.surface, ...Shadows.card },
  speedTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  speedTitle: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 13, fontWeight: '700' },
  speedCurrent: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '800' },
  speedOptions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  speedOption: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#F0F2ED' },
  speedOptionActive: { backgroundColor: Palette.primary },
  speedOptionText: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700' },
  speedOptionTextActive: { color: '#FFFFFF' },
  note: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginTop: Spacing.four, padding: Spacing.three, borderRadius: Radius.card, backgroundColor: '#EEF1EA' },
  noteIcon: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#DCEBDD' },
  noteText: { flex: 1, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, lineHeight: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.four, padding: Spacing.seven },
  errorTitle: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 22, fontWeight: '700' },
  backToLessons: { paddingHorizontal: Spacing.five, paddingVertical: Spacing.three, borderRadius: Radius.pill, backgroundColor: Palette.primary },
  backToLessonsText: { color: '#FFFFFF', fontFamily: Fonts.sans, fontSize: 13, fontWeight: '700' },
});

import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAudioPlayback } from '@/audio/use-audio-playback';
import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';
import { lessons, type LessonThumbnailIcon } from '@/data/lessons';
import type { ComponentProps } from 'react';

const iconNames: Record<LessonThumbnailIcon, ComponentProps<typeof SymbolView>['name']> = {
  book: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  layers: { ios: 'square.3.layers.3d', android: 'layers', web: 'layers' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  branch: { ios: 'arrow.triangle.branch', android: 'account_tree', web: 'account_tree' },
  chat: { ios: 'bubble.left.fill', android: 'chat_bubble', web: 'chat_bubble' },
};

export function MiniPlayer() {
  const audio = useAudioPlayback();
  const [dismissedLessonId, setDismissedLessonId] = useState<string | null>(null);
  const lesson = lessons.find((item) => item.id === audio.lessonId);

  if (!lesson || audio.state === 'idle' || dismissedLessonId === lesson.id) return null;

  const duration = audio.duration > 0 ? audio.duration : lesson.durationSeconds;
  const currentTime = audio.state === 'finished' ? duration : audio.currentTime;
  const progress = duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0;
  const isPlaying = audio.state === 'playing';
  const isLoading = audio.state === 'loading';
  const isFinished = audio.state === 'finished';
  const openPlayer = () => router.navigate({ pathname: '/player/[lessonId]', params: { lessonId: lesson.id } });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Buɗe mai kunna sauti: ${lesson.title}`}
          onPress={openPlayer}
          style={styles.lessonButton}>
          <View style={styles.artwork}>
            <SymbolView name={iconNames[lesson.thumbnailIcon]} tintColor={Palette.primary} size={20} />
          </View>
          <View style={styles.lessonCopy}>
            <Text numberOfLines={1} style={styles.title}>{lesson.title}</Text>
            <Text numberOfLines={1} style={styles.status}>
              {isPlaying ? 'Ana sauraro' : isLoading ? 'Ana shiryawa' : isFinished ? 'An kammala' : 'An dakatar'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Dakatar da sauraro' : isFinished ? 'Sake saurara' : 'Ci gaba da sauraro'}
          accessibilityState={{ disabled: isLoading }}
          disabled={isLoading}
          onPress={() => audio.togglePlayback(lesson.id)}
          style={({ pressed }) => [styles.controlButton, pressed && styles.pressed, isLoading && styles.disabled]}>
          <SymbolView
            name={isPlaying ? { ios: 'pause.fill', android: 'pause', web: 'pause' } : isFinished ? { ios: 'arrow.counterclockwise', android: 'replay', web: 'replay' } : { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }}
            tintColor={Palette.primaryDark}
            size={21}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Rufe ƙaramin mai kunna sauti"
          onPress={() => setDismissedLessonId(lesson.id)}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
          <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor={Palette.textSecondary} size={15} />
        </Pressable>
      </View>
      <View accessibilityLabel="Ci gaban sauraro" accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }} style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.two, backgroundColor: Palette.background },
  row: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.two, borderRadius: Radius.card, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  lessonButton: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  artwork: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: Palette.greenSoft },
  lessonCopy: { flex: 1, minWidth: 0 },
  title: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700' },
  status: { marginTop: 2, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '500' },
  controlButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, backgroundColor: Palette.greenSoft },
  closeButton: { width: 30, height: 38, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
  disabled: { opacity: 0.5 },
  progressTrack: { height: 2, marginTop: 5, marginHorizontal: Spacing.two, overflow: 'hidden', borderRadius: 2, backgroundColor: '#DCE5DE' },
  progressFill: { height: '100%', backgroundColor: Palette.green },
});

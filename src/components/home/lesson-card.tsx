import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Lesson, LessonThumbnailIcon } from '@/data/lessons';
import { formatLessonDuration } from '@/data/lessons';
import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';

type Props = {
  lesson: Lesson;
  number?: number;
  featured?: boolean;
  layout?: 'compact' | 'vertical';
  onPress?: () => void;
};

const iconNames: Record<LessonThumbnailIcon, ComponentProps<typeof SymbolView>['name']> = {
  book: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  layers: { ios: 'square.3.layers.3d', android: 'layers', web: 'layers' },
  calendar: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  branch: { ios: 'arrow.triangle.branch', android: 'account_tree', web: 'account_tree' },
  chat: { ios: 'bubble.left.fill', android: 'chat_bubble', web: 'chat_bubble' },
};

function getProgressLabel(lesson: Lesson) {
  if (lesson.completed) return 'An kammala';
  if (lesson.progress > 0) return `${Math.round(lesson.progress * 100)}% an saurara`;
  return 'Sabon darasi';
}

function ProgressTrack({ progress, completed = false, light = false }: { progress: number; completed?: boolean; light?: boolean }) {
  const value = completed ? 1 : Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.progressTrack, light && styles.progressTrackLight]}>
      <View style={[styles.progressFill, light && styles.progressFillLight, { width: `${Math.round(value * 100)}%` }]} />
    </View>
  );
}

export function LessonCard({ lesson, number = 1, featured = false, layout = 'compact', onPress }: Props) {
  const duration = formatLessonDuration(lesson.durationSeconds);

  if (featured) {
    return (
      <View style={styles.featuredCard}>
        <View pointerEvents="none" style={styles.featuredGlow} />
        <View style={styles.featuredTop}>
          <View style={styles.featuredTag}>
            <View style={styles.liveDot} />
            <Text style={styles.featuredTagText}>CI GABA DA SAURARO</Text>
          </View>
          <Text style={styles.featuredCount}>DARASI {String(number).padStart(2, '0')}</Text>
        </View>
        <Text style={styles.featuredTitle}>{lesson.title}</Text>
        <View style={styles.featuredBottom}>
          <View style={styles.featuredProgressBlock}>
            <View style={styles.durationRow}>
              <SymbolView name={{ ios: 'clock', android: 'schedule', web: 'schedule' }} tintColor="#D5E5DD" size={14} />
              <Text style={styles.featuredDuration}>{duration}</Text>
              <Text style={styles.progressLabel}>{getProgressLabel(lesson)}</Text>
            </View>
            <ProgressTrack progress={lesson.progress} completed={lesson.completed} light />
          </View>
          <View accessible accessibilityRole="image" accessibilityLabel="Alamar kunna sauti; kunna darasi bai samuwa ba tukuna" style={styles.playButton}>
            <SymbolView name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }} tintColor={Palette.primaryDark} size={18} />
          </View>
        </View>
      </View>
    );
  }

  if (layout === 'vertical') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Darasi ${number}: ${lesson.title}, mintuna ${duration}`}
        onPress={onPress}
        style={({ pressed }) => [styles.verticalCard, pressed && styles.pressed]}>
        <View style={styles.verticalTop}>
          <View style={styles.numberPill}><Text style={styles.numberText}>{String(number).padStart(2, '0')}</Text></View>
          <View style={styles.verticalIcon}>
            <SymbolView name={iconNames[lesson.thumbnailIcon]} tintColor={Palette.primary} size={18} />
          </View>
          <View style={styles.verticalMeta}>
            <Text style={styles.verticalDuration}>{duration}</Text>
            {lesson.completed && <Text style={styles.completedBadge}>An kammala</Text>}
          </View>
          <View accessible accessibilityRole="image" accessibilityLabel="Alamar kunna sauti" style={styles.smallPlayButton}>
            <SymbolView name={{ ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' }} tintColor={Palette.primary} size={13} />
          </View>
        </View>
        <Text style={styles.verticalTitle}>{lesson.title}</Text>
        <Text numberOfLines={2} style={styles.verticalDescription}>{lesson.description}</Text>
        <View style={styles.verticalProgressRow}>
          <ProgressTrack progress={lesson.progress} completed={lesson.completed} />
          <Text style={styles.verticalProgressLabel}>{getProgressLabel(lesson)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}, mintuna ${duration}`}
      onPress={onPress}
      style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]}>
      <View style={styles.lessonIcon}>
        <SymbolView name={iconNames[lesson.thumbnailIcon]} tintColor={Palette.primary} size={19} />
      </View>
      <View style={styles.lessonCopy}>
        <Text numberOfLines={2} style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonMeta}>
          <Text style={styles.lessonTopic}>{lesson.completed ? 'An kammala' : lesson.progress > 0 ? 'A ci gaba' : 'Sabon darasi'}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.lessonDuration}>{duration}</Text>
        </View>
      </View>
      <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor="#96A3A0" size={14} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuredCard: { overflow: 'hidden', minHeight: 216, justifyContent: 'space-between', padding: Spacing.five, borderRadius: Radius.large, backgroundColor: Palette.primaryDark },
  featuredGlow: { position: 'absolute', width: 230, height: 230, borderRadius: 115, right: -66, top: -90, backgroundColor: '#145B54' },
  featuredTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featuredTag: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 7, borderRadius: Radius.pill, backgroundColor: 'rgba(255,255,255,0.13)' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#95D5A9' },
  featuredTagText: { color: '#E3F2E8', fontFamily: Fonts.sans, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  featuredCount: { color: '#B5CDC4', fontFamily: Fonts.sans, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  featuredTitle: { maxWidth: '88%', marginTop: Spacing.four, marginBottom: Spacing.five, color: '#FFFFFF', fontFamily: Fonts.sans, fontSize: 23, lineHeight: 30, fontWeight: '700' },
  featuredBottom: { flexDirection: 'row', alignItems: 'center', gap: Spacing.four },
  featuredProgressBlock: { flex: 1 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  featuredDuration: { color: '#D5E5DD', fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600' },
  progressLabel: { marginLeft: 'auto', color: '#B5CDC4', fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600' },
  progressTrack: { height: 5, flex: 1, borderRadius: 3, backgroundColor: '#E6EAE3', overflow: 'hidden' },
  progressTrackLight: { backgroundColor: 'rgba(255,255,255,0.2)' },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: Palette.green },
  progressFillLight: { backgroundColor: '#8FCB9D' },
  playButton: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F2E8' },
  verticalCard: { padding: Spacing.four, borderRadius: Radius.card, borderWidth: 1, borderColor: '#EAEDE6', backgroundColor: Palette.surface },
  verticalTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  numberPill: { minWidth: 34, height: 30, paddingHorizontal: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  numberText: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '800' },
  verticalIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F1' },
  verticalMeta: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  verticalDuration: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '600' },
  completedBadge: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 9, fontWeight: '700' },
  smallPlayButton: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  verticalTitle: { marginTop: Spacing.three, color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 15, lineHeight: 21, fontWeight: '700' },
  verticalDescription: { marginTop: 5, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
  verticalProgressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, marginTop: Spacing.three },
  verticalProgressLabel: { minWidth: 82, textAlign: 'right', color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600' },
  lessonCard: { width: 245, minHeight: 106, flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.four, borderRadius: Radius.card, backgroundColor: Palette.surface, borderWidth: 1, borderColor: '#ECEDE7' },
  lessonIcon: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  lessonCopy: { flex: 1 },
  lessonTitle: { color: Palette.text, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
  lessonTopic: { maxWidth: 125, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '500' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#A8B1AE' },
  lessonDuration: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600' },
  pressed: { opacity: 0.78 },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, Palette, Radius, Spacing } from '@/constants/theme';

const ONBOARDING_COMPLETE_KEY = '@san-genotype/onboarding-complete';

const slides = [
  {
    title: 'San genotype ɗinka.',
    body: 'Sanin genotype muhimmin ilimi ne game da kai, musamman kafin aure.',
    illustration: 'knowledge',
  },
  {
    title: 'Saurara ka fahimta.',
    body: 'Akwai gajerun darussan sauti cikin Hausa da za ka saurara yayin ayyukan yau da kullum.',
    illustration: 'audio',
  },
  {
    title: 'Sani kafin aure.',
    body: 'Manufarmu ita ce ilimi da wayar da kai, domin tattaunawa cikin sani da neman shawarwarin ƙwararrun da suka dace.',
    illustration: 'conversation',
  },
] as const;

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)
      .then((value) => {
        if (mounted) setComplete(value === 'true');
      })
      .catch(() => {
        // If storage is unavailable, keep onboarding usable for this session.
      })
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const finishOnboarding = useCallback(async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    } catch {
      // Completion still works for this session when storage is unavailable.
    } finally {
      setComplete(true);
      setSaving(false);
    }
  }, []);

  const resetOnboardingForDevelopment = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    } catch {
      // The in-memory flow can still be reset during this session.
    } finally {
      setPage(0);
      setComplete(false);
    }
  }, []);

  const goToPage = (nextPage: number) => {
    scrollRef.current?.scrollTo({ x: width * nextPage, animated: true });
    setPage(nextPage);
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  if (!ready) {
    return <View style={styles.loading} />;
  }

  if (complete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.finishedContent}>
          <View style={styles.finishedMark}>
            <Text style={styles.finishedMarkText}>✓</Text>
          </View>
          <Text accessibilityRole="header" style={styles.finishedTitle}>
            Barka da zuwa San Genotype.
          </Text>
          <Text style={styles.finishedBody}>
            Ka kammala gabatarwa. Za mu ci gaba da samar da ilimi da wayar da kai.
          </Text>
          <Text style={styles.finishedNote}>Ilimi ne; don shawarwari, tuntubi ƙwararre.</Text>
          {__DEV__ && (
            <Pressable onPress={resetOnboardingForDevelopment} style={styles.devReset}>
              <Text style={styles.devResetText}>Sake gwada gabatarwa (development)</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>SG</Text></View>
          <Text style={styles.brandName}>San Genotype</Text>
        </View>
        {page < slides.length - 1 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tsallake gabatarwa"
            hitSlop={12}
            onPress={finishOnboarding}
            style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
            <Text style={styles.skipText}>Tsallake</Text>
          </Pressable>
        ) : <View style={styles.skipPlaceholder} />}
      </View>

      <View style={styles.progressRow} accessibilityLabel={`Mataki ${page + 1} cikin 3`}>
        {slides.map((slide, index) => (
          <View key={slide.title} style={[styles.progressTrack, index <= page && styles.progressActive]} />
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        style={styles.pager}
        accessibilityLabel="Gabatarwar San Genotype">
        {slides.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <Illustration kind={slide.illustration} />
            <View style={styles.copy}>
              <Text accessibilityRole="header" style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
          disabled={saving}
          onPress={() => page < slides.length - 1 ? goToPage(page + 1) : finishOnboarding()}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed, saving && styles.buttonDisabled]}>
          <Text style={styles.primaryButtonText}>
            {saving ? 'Ana kammalawa…' : page === slides.length - 1 ? 'Na fahimta' : 'Ci gaba'}
          </Text>
          {page < slides.length - 1 && <Text style={styles.buttonArrow}>→</Text>}
        </Pressable>
        <Text style={styles.stepLabel}>{String(page + 1).padStart(2, '0')} / 03</Text>
      </View>
    </SafeAreaView>
  );
}

function Illustration({ kind }: { kind: (typeof slides)[number]['illustration'] }) {
  if (kind === 'knowledge') {
    return (
      <View accessible accessibilityLabel="Alamar ilimi" accessibilityRole="image" style={styles.illustration}>
        <View style={styles.sunShape} />
        <View style={styles.infoCard}>
          <View style={styles.infoBadge}><Text style={styles.infoBadgeText}>SG</Text></View>
          <View style={styles.infoLineLong} />
          <View style={styles.infoLineShort} />
          <View style={styles.infoDot} />
        </View>
        <View style={styles.leafShape} />
        <View style={styles.smallDot} />
      </View>
    );
  }
  if (kind === 'audio') {
    return (
      <View accessible accessibilityLabel="Alamar darussan sauti" accessibilityRole="image" style={[styles.illustration, styles.audioIllustration]}>
        <View style={styles.audioCircle}>
          <View style={styles.waveform}>
            {[18, 32, 48, 25, 40, 18, 31].map((height, index) => (
              <View key={index} style={[styles.waveBar, { height }]} />
            ))}
          </View>
          <View style={styles.playButton}><Text style={styles.playGlyph}>▶</Text></View>
        </View>
        <View style={styles.audioCaption}><View style={styles.captionDot} /><View style={styles.captionLine} /></View>
      </View>
    );
  }
  return (
    <View accessible accessibilityLabel="Alamar tattaunawa cikin sani" accessibilityRole="image" style={[styles.illustration, styles.conversationIllustration]}>
      <View style={styles.bubbleBack}><View style={styles.bubbleLine} /><View style={styles.bubbleLineShort} /></View>
      <View style={styles.bubbleFront}><View style={styles.bubbleAccent} /><View style={styles.bubbleLine} /><View style={styles.bubbleLineShort} /></View>
      <View style={styles.guidanceTag}><Text style={styles.guidanceTagText}>Ilimi · Tattaunawa</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  loading: { flex: 1, backgroundColor: Palette.background },
  topBar: { height: 56, marginHorizontal: Spacing.six, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  brandMark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.greenSoft },
  brandMarkText: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '800' },
  brandName: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 15, fontWeight: '700' },
  skipButton: { paddingVertical: 10, paddingHorizontal: 8 },
  skipText: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 14, fontWeight: '600' },
  skipPlaceholder: { width: 56 },
  progressRow: { height: 4, flexDirection: 'row', gap: 6, marginHorizontal: Spacing.six, marginTop: Spacing.two },
  progressTrack: { height: 4, flex: 1, borderRadius: Radius.pill, backgroundColor: '#E7E9E2' },
  progressActive: { backgroundColor: Palette.primary },
  pager: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.seven, paddingTop: Spacing.four },
  illustration: { height: '52%', maxHeight: 350, minHeight: 230, width: '100%', maxWidth: 420, borderRadius: 36, backgroundColor: '#EEF1E8', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  sunShape: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: '#DDEBDB', top: 28, right: 22 },
  infoCard: { width: 190, height: 192, borderRadius: 26, backgroundColor: Palette.surface, padding: 22, justifyContent: 'center', ...{ elevation: 3 } },
  infoBadge: { width: 48, height: 48, borderRadius: 16, backgroundColor: Palette.greenSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  infoBadgeText: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 16, fontWeight: '800' },
  infoLineLong: { width: 128, height: 10, borderRadius: 5, backgroundColor: '#DDE4DE', marginBottom: 10 },
  infoLineShort: { width: 82, height: 8, borderRadius: 4, backgroundColor: '#E8ECE8' },
  infoDot: { position: 'absolute', right: 20, top: 26, width: 12, height: 12, borderRadius: 6, backgroundColor: Palette.warning },
  leafShape: { position: 'absolute', width: 42, height: 72, borderRadius: 30, backgroundColor: '#A8CDA8', bottom: 42, left: 40, transform: [{ rotate: '-34deg' }] },
  smallDot: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#E7B676', top: 54, left: 58 },
  audioIllustration: { backgroundColor: '#E9EFE9' },
  audioCircle: { width: 208, height: 208, borderRadius: 104, backgroundColor: '#DCE9DD', alignItems: 'center', justifyContent: 'center' },
  waveform: { height: 68, flexDirection: 'row', alignItems: 'center', gap: 7 },
  waveBar: { width: 7, borderRadius: 5, backgroundColor: Palette.primary },
  playButton: { position: 'absolute', bottom: 20, width: 48, height: 48, borderRadius: 24, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center', paddingLeft: 3 },
  playGlyph: { color: '#FFFFFF', fontSize: 15 },
  audioCaption: { position: 'absolute', bottom: 36, right: 30, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: Radius.pill, backgroundColor: Palette.surface },
  captionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.green },
  captionLine: { width: 42, height: 6, borderRadius: 3, backgroundColor: '#DDE4DE' },
  conversationIllustration: { backgroundColor: '#F1EDE3' },
  bubbleBack: { position: 'absolute', width: 190, height: 122, borderRadius: 26, backgroundColor: '#E0E7DC', top: '22%', left: '12%', padding: 24, justifyContent: 'center', gap: 12 },
  bubbleFront: { position: 'absolute', width: 190, height: 128, borderRadius: 26, backgroundColor: Palette.surface, bottom: '18%', right: '10%', padding: 24, justifyContent: 'center', gap: 12, ...{ elevation: 3 } },
  bubbleLine: { height: 8, width: 128, borderRadius: 4, backgroundColor: '#DDE4DE' },
  bubbleLineShort: { height: 8, width: 84, borderRadius: 4, backgroundColor: '#E8ECE8' },
  bubbleAccent: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: Palette.greenSoft, right: 22, top: 18 },
  guidanceTag: { position: 'absolute', bottom: 24, left: 24, paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.pill, backgroundColor: '#F8F7F2' },
  guidanceTagText: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700' },
  copy: { width: '100%', maxWidth: 420, alignItems: 'center', paddingTop: Spacing.five },
  title: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 31, lineHeight: 39, fontWeight: '800', textAlign: 'center' },
  body: { maxWidth: 370, marginTop: Spacing.three, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 16, lineHeight: 25, textAlign: 'center' },
  bottomArea: { paddingHorizontal: Spacing.six, paddingTop: Spacing.two, paddingBottom: Spacing.three, alignItems: 'center' },
  primaryButton: { minHeight: 58, width: '100%', maxWidth: 420, paddingHorizontal: Spacing.five, borderRadius: Radius.pill, backgroundColor: Palette.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontFamily: Fonts.sans, fontSize: 16, fontWeight: '700' },
  buttonArrow: { position: 'absolute', right: 24, color: '#FFFFFF', fontSize: 23, lineHeight: 28 },
  buttonPressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.7 },
  stepLabel: { marginTop: Spacing.two, color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  pressed: { opacity: 0.7 },
  finishedContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.seven },
  finishedMark: { width: 76, height: 76, borderRadius: 38, backgroundColor: Palette.greenSoft, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.six },
  finishedMarkText: { color: Palette.primary, fontSize: 36, fontWeight: '700' },
  finishedTitle: { color: Palette.primaryDark, fontFamily: Fonts.sans, fontSize: 28, lineHeight: 36, fontWeight: '800', textAlign: 'center' },
  finishedBody: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 16, lineHeight: 25, textAlign: 'center', maxWidth: 370, marginTop: Spacing.three },
  finishedNote: { color: Palette.primary, fontFamily: Fonts.sans, fontSize: 13, lineHeight: 20, fontWeight: '600', textAlign: 'center', marginTop: Spacing.seven },
  devReset: { marginTop: Spacing.seven, padding: Spacing.three },
  devResetText: { color: Palette.textSecondary, fontFamily: Fonts.sans, fontSize: 12, textDecorationLine: 'underline' },
});

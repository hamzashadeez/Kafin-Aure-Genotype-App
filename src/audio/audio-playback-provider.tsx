import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { lessons } from '@/data/lessons';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'finished' | 'error';
export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export type AudioPlaybackValue = {
  lessonId: string | null;
  state: PlaybackState;
  currentTime: number;
  duration: number;
  playbackRate: PlaybackSpeed;
  error: string | null;
  playLesson: (lessonId: string) => void;
  togglePlayback: (lessonId: string) => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  seekBy: (seconds: number) => void;
  setPlaybackRate: (rate: PlaybackSpeed) => void;
};

export const AudioPlaybackContext = createContext<AudioPlaybackValue | null>(null);

export function AudioPlaybackProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const audioStatus = useAudioPlayerStatus(player);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [hasFinished, setHasFinished] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const lessonIdRef = useRef<string | null>(null);
  const loadedAssetRef = useRef<number | null>(null);
  const pendingStartRef = useRef(false);
  const sawUnloadedRef = useRef(false);
  const requiresLoadTransitionRef = useRef(false);

  useEffect(() => {
    let active = true;
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch((error: unknown) => {
      if (active) setServiceError(error instanceof Error ? error.message : 'Ba a iya saita sauti ba.');
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const subscription = player.addListener('playbackStatusUpdate', (nextStatus) => {
      if (nextStatus.didJustFinish) setHasFinished(true);
    });
    return () => subscription.remove();
  }, [player]);

  useEffect(() => () => player.clearLockScreenControls(), [player]);

  useEffect(() => {
    if (!lessonId) return;

    if (audioStatus.error) {
      pendingStartRef.current = false;
      return;
    }

    if (audioStatus.didJustFinish) {
      pendingStartRef.current = false;
      return;
    }

    if (pendingStartRef.current) {
      if (!audioStatus.isLoaded) {
        sawUnloadedRef.current = true;
        return;
      }
      if (!requiresLoadTransitionRef.current || sawUnloadedRef.current) {
        pendingStartRef.current = false;
        requiresLoadTransitionRef.current = false;
        player.play();
      }
    }
  }, [audioStatus, lessonId, player]);

  const playLesson = useCallback((nextLessonId: string) => {
    const lesson = lessons.find((item) => item.id === nextLessonId);
    if (!lesson) {
      lessonIdRef.current = nextLessonId;
      setLessonId(nextLessonId);
      setServiceError('Ba a sami darasin ba.');
      return;
    }
    if (lesson.audioAsset === null) {
      lessonIdRef.current = nextLessonId;
      setLessonId(nextLessonId);
      setServiceError('Ba a saka sautin wannan darasi ba tukuna.');
      return;
    }

    const isNewLesson = lessonIdRef.current !== nextLessonId;
    const shouldRestart = isNewLesson || hasFinished || audioStatus.didJustFinish;
    player.setActiveForLockScreen(true, {
      title: lesson.title,
      artist: 'San Genotype',
      albumTitle: 'Darussan sauti',
    });
    if (isNewLesson) {
      player.pause();
      setHasFinished(false);
    }
    lessonIdRef.current = nextLessonId;
    setLessonId(nextLessonId);
    setServiceError(null);

    const needsSourceReplacement = loadedAssetRef.current !== lesson.audioAsset;
    if (needsSourceReplacement) {
      pendingStartRef.current = true;
      requiresLoadTransitionRef.current = true;
      sawUnloadedRef.current = !audioStatus.isLoaded;
      loadedAssetRef.current = lesson.audioAsset;
      player.replace(lesson.audioAsset);
      player.setPlaybackRate(audioStatus.playbackRate);
      return;
    }

    if (audioStatus.isLoaded) {
      pendingStartRef.current = false;
      if (shouldRestart) {
        player.seekTo(0).then(() => {
          setHasFinished(false);
          player.play();
        }).catch((error: unknown) => {
          setServiceError(error instanceof Error ? error.message : 'Ba a iya sake kunna sautin ba.');
        });
        return;
      }
      player.play();
    } else {
      pendingStartRef.current = true;
      requiresLoadTransitionRef.current = false;
      sawUnloadedRef.current = true;
    }
  }, [audioStatus.didJustFinish, audioStatus.isLoaded, audioStatus.playbackRate, hasFinished, player]);

  const pause = useCallback(() => {
    pendingStartRef.current = false;
    player.pause();
  }, [player]);

  const togglePlayback = useCallback((targetLessonId: string) => {
    if (lessonIdRef.current !== targetLessonId || !audioStatus.playing) {
      playLesson(targetLessonId);
    } else {
      pause();
    }
  }, [audioStatus.playing, pause, playLesson]);

  const seekTo = useCallback((seconds: number) => {
    if (!audioStatus.isLoaded || !Number.isFinite(seconds)) return;
    const upperBound = audioStatus.duration > 0 ? audioStatus.duration : Number.MAX_SAFE_INTEGER;
    const target = Math.max(0, Math.min(upperBound, seconds));
    setHasFinished(false);
    player.seekTo(target).catch((error: unknown) => {
      setServiceError(error instanceof Error ? error.message : 'Ba a iya matsar da sauti ba.');
    });
  }, [audioStatus.duration, audioStatus.isLoaded, player]);

  const seekBy = useCallback((seconds: number) => {
    seekTo(audioStatus.currentTime + seconds);
  }, [audioStatus.currentTime, seekTo]);

  const setRate = useCallback((rate: PlaybackSpeed) => {
    if (!PLAYBACK_SPEEDS.includes(rate)) return;
    try {
      player.setPlaybackRate(rate);
    } catch (error) {
      setServiceError(error instanceof Error ? error.message : 'Ba a iya sauya saurin sauti ba.');
    }
  }, [player]);

  const state: PlaybackState = !lessonId
    ? 'idle'
    : serviceError || audioStatus.error
      ? 'error'
      : hasFinished || audioStatus.didJustFinish
        ? 'finished'
        : !audioStatus.isLoaded
          ? 'loading'
          : audioStatus.playing
            ? 'playing'
            : 'paused';

  const value = useMemo<AudioPlaybackValue>(() => ({
    lessonId,
    state,
    currentTime: audioStatus.currentTime,
    duration: audioStatus.duration,
    playbackRate: audioStatus.playbackRate as PlaybackSpeed,
    error: serviceError ?? audioStatus.error,
    playLesson,
    togglePlayback,
    pause,
    seekTo,
    seekBy,
    setPlaybackRate: setRate,
  }), [
    audioStatus.currentTime,
    audioStatus.duration,
    audioStatus.error,
    audioStatus.playbackRate,
    lessonId,
    pause,
    playLesson,
    seekBy,
    seekTo,
    serviceError,
    setRate,
    state,
    togglePlayback,
  ]);

  return <AudioPlaybackContext.Provider value={value}>{children}</AudioPlaybackContext.Provider>;
}

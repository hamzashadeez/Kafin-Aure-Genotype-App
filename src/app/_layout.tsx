import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AudioPlaybackProvider } from '@/audio/audio-playback-provider';
import { Palette } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AudioPlaybackProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Palette.background },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="lesson/[lessonId]" />
      </Stack>
    </AudioPlaybackProvider>
  );
}

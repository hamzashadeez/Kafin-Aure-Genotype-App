import { useContext } from 'react';

import { AudioPlaybackContext } from '@/audio/audio-playback-provider';

export function useAudioPlayback() {
  const playback = useContext(AudioPlaybackContext);
  if (!playback) {
    throw new Error('useAudioPlayback must be used inside AudioPlaybackProvider.');
  }
  return playback;
}

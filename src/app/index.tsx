import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ONBOARDING_COMPLETE_KEY } from '@/constants/storage';
import { Palette } from '@/constants/theme';

type Destination = '/onboarding' | '/(main)';

export default function EntryRoute() {
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)
      .then((value) => {
        if (active) setDestination(value === 'true' ? '/(main)' : '/onboarding');
      })
      .catch(() => {
        if (active) setDestination('/onboarding');
      });
    return () => {
      active = false;
    };
  }, []);

  if (!destination) return <View style={{ flex: 1, backgroundColor: Palette.background }} />;
  return <Redirect href={destination} />;
}

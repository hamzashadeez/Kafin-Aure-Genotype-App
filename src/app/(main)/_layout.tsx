import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { Palette } from '@/constants/theme';

const tabIcons = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  lessons: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  about: { ios: 'info.circle.fill', android: 'info', web: 'info' },
} as const;

export default function MainTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 3 },
        tabBarIconStyle: { marginTop: 3 },
        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: 4,
          backgroundColor: Palette.surface,
          borderTopColor: Palette.border,
          elevation: 8,
        },
        sceneStyle: { backgroundColor: Palette.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, size }) => <SymbolView name={tabIcons.home} tintColor={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Lessons',
          tabBarAccessibilityLabel: 'Lessons',
          tabBarIcon: ({ color, size }) => <SymbolView name={tabIcons.lessons} tintColor={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarAccessibilityLabel: 'About',
          tabBarIcon: ({ color, size }) => <SymbolView name={tabIcons.about} tintColor={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

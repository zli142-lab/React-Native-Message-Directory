import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { hydrateMessages } from '@/data/message-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void hydrateMessages();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="index" options={{ title: 'Message Directory' }} />
        <Stack.Screen name="directory/[id]" options={{ title: 'Messages' }} />
        <Stack.Screen
          name="message/[id]"
          options={{ headerLargeTitle: false, title: 'Message' }}
        />
        <Stack.Screen
          name="add-message"
          options={{
            presentation: 'modal',
            headerLargeTitle: false,
            title: 'New Message',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

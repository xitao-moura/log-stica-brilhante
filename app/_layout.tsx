import { BackHandler } from 'react-native';

// Monkey‐patch para evitar o crash
if (typeof (BackHandler as any).removeEventListener !== 'function') {
  (BackHandler as any).removeEventListener = (
    _event: string,
    _handler: any
  ) => {
    /* stub vazio */
  };
}

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NativeBaseProvider } from 'native-base';
import DrawerProvider from '../src/components/MenuDrawer';
import { AuthProvider } from '../src/contexts/AuthContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <AuthProvider>
        <DrawerProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack
              initialRouteName='index'
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name='index' />
              <Stack.Screen name='(auth)' />
              <Stack.Screen name='pedidos' />
              <Stack.Screen name='home' />
            </Stack>
          </ThemeProvider>
        </DrawerProvider>
      </AuthProvider>
    </NativeBaseProvider>
  );
}

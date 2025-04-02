import { Slot, Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Slot />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
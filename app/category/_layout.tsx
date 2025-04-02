import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function CategoryLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{
        headerShown: true,
        headerStyle: {
            backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card
        },
        headerTintColor: colorScheme === 'dark' ? DarkTheme.colors.text : DefaultTheme.colors.text,
    }}>
      <Stack.Screen 
        name="[categoryId]" 
        options={({ route }: any) => ({ 
          title: route.params?.categoryName || 'Category',
          headerBackTitle: 'Back',
          headerBackVisible: true,
        })} 
      />
    </Stack>
  );
}
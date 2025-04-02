import { Stack } from 'expo-router';

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      // headerBackVisible: true,
    }}>
      <Stack.Screen 
        name="[categoryId]" 
        options={{
          headerShown: false,
          // title: route.params?.categoryName || 'Category',
          presentation: 'card'
        }}
      />
    </Stack>
  );
}
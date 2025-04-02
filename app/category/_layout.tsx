import { Stack } from 'expo-router';

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{
      headerBackVisible: true,
      headerShadowVisible: true,
      headerBackTitle: "Back"
    }}>
      <Stack.Screen 
        name="[categoryId]" 
        options={({ route }: any) => ({
          headerShown: false,
          title: route.params?.categoryName || 'Category',
          presentation: 'card'
        })}
      />
    </Stack>
  );
}
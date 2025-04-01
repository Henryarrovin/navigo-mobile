import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./home";
import MapScreen from "./map";

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
  return (
    <Tab.Navigator
      id={undefined}
      // screenOptions={{
      //   headerShown: true,
      //   tabBarActiveTintColor: "blue",
      //   tabBarInactiveTintColor: "gray",
      // }}
      screenOptions={({ route }) => ({
        headerTitle: route.name,
        headerStyle: { backgroundColor: '#333333' },
        headerTintColor: '#ffffff',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default TabsLayout;
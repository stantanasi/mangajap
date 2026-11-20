import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#d40e0e',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          overflow: 'visible',
        },
      }}
    >
      <Tabs.Screen
        name="agenda-anime"
        options={{
          tabBarLabel: 'Animé',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="tv"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="agenda-manga"
        options={{
          tabBarLabel: 'Manga',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="menu-book"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Découvrir',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="search"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

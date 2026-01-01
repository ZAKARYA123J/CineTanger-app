import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/components/ui/reservation/use-color-scheme';
import { CinetangerColors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='filmScreen'
      screenOptions={{
        tabBarActiveTintColor: CinetangerColors.tabBar.active,
        tabBarInactiveTintColor: CinetangerColors.tabBar.inactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: CinetangerColors.tabBar.background[(colorScheme === 'dark' ? 'dark' : 'light')],
          borderTopColor: CinetangerColors.border[(colorScheme === 'dark' ? 'dark' : 'light')],
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="filmScreen"
        options={{
          title: 'filmScreen',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size || 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Réservations',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size || 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
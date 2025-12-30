import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // CinéTanger colors
  const activeColor = '#E50914'; // Cinema red
  const inactiveColor = '#8E8E93';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Films',
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { processReservationQueue } from "../service/reservationStorage";
import { createReservation } from "../service/api";

const queryClient = new QueryClient();

export default function Layout() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let unsubscribe: any;
    const init = async () => {
      try {
        const dynamicImport: any = (Function("return import"))();
        const mod: any = await dynamicImport("@react-native-community/" + "netinfo");
        unsubscribe = mod.default.addEventListener((state: any) => {
          const ok = Boolean(state.isConnected && state.isInternetReachable !== false);
          setIsConnected(ok);
        });
      } catch {
        setIsConnected(true);
      }
    };
    init();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      processReservationQueue((payload) => createReservation(payload));
    }
  }, [isConnected]);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {!isConnected && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Hors ligne</Text>
          </View>
        )}
        <Stack initialRouteName="register" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  banner: {
    backgroundColor: "#d41132",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 12,
  },
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack initialRouteName="register" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="register" options={{ title: "register" }} />
                <Stack.Screen name="filmScreen" options={{ title: "filmScreen" }} />
                <Stack.Screen name="filmDetails" options={{ title: "filmDetails" }} />
            </Stack>
        </QueryClientProvider>
    );
}

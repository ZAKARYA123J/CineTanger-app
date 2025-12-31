import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function Layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack initialRouteName="filmScreen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="filmScreen" options={{ title: "filmScreen" }} />
                <Stack.Screen name="filmDetails" options={{ title: "filmDetails" }} />
            </Stack>
        </QueryClientProvider>
    );
}

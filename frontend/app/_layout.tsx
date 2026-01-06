import { Stack } from "expo-router";
import { initSentry } from '../sentry.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

initSentry();

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
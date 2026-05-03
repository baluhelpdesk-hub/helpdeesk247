import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../src/store/authStore";
import { profileApi } from "../src/api/profile.api";
import { registerForPushNotifications } from "../src/utils/notifications";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AuthGuard() {
  const { accessToken, isLoading, loadTokens } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";

    if (!accessToken) {
      if (!inAuth) router.replace("/(auth)/login");
      return;
    }

    profileApi.get().then((profile) => {
      if (!profile?.onboardingDone && !inOnboarding) {
        router.replace("/(onboarding)/step-1-age-sex");
      } else if (profile?.onboardingDone && (inAuth || inOnboarding)) {
        router.replace("/(app)/today");
      }
      registerForPushNotifications().then((token) => {
        if (token) profileApi.savePushToken(token).catch(() => null);
      });
    }).catch(() => {
      if (!inAuth) router.replace("/(auth)/login");
    });
  }, [accessToken, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}

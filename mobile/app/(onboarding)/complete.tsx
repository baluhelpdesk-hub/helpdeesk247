import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { profileApi } from "../../src/api/profile.api";
import { Colors } from "../../src/constants/colors";

export default function OnboardingComplete() {
  const { data, reset } = useOnboardingStore();
  const router = useRouter();
  const [status, setStatus] = useState("Creating your personalised program...");

  useEffect(() => {
    profileApi.complete(data)
      .then(() => {
        setStatus("Your program is ready!");
        reset();
        setTimeout(() => router.replace("/(app)/today"), 1000);
      })
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        Alert.alert("Error", msg ?? "Something went wrong", [
          { text: "Try again", onPress: () => router.back() },
        ]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background, gap: 20 },
  text: { fontSize: 18, color: Colors.textPrimary, fontWeight: "500" },
});

import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { profileApi } from "../../../src/api/profile.api";
import { habitsApi } from "../../../src/api/habits.api";
import { authApi } from "../../../src/api/auth.api";
import { useAuthStore } from "../../../src/store/authStore";
import { Colors } from "../../../src/constants/colors";
import { getTokens } from "../../../src/utils/tokens";

const DAYS_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const { data: habits } = useQuery({ queryKey: ["habits"], queryFn: habitsApi.get });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => profileApi.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const updateHabitsMutation = useMutation({
    mutationFn: (data: Parameters<typeof habitsApi.update>[0]) => habitsApi.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  function toggleDay(day: number) {
    if (!habits) return;
    const current: number[] = habits.trainingDays ?? [];
    const next = current.includes(day) ? current.filter((d: number) => d !== day) : [...current, day].sort();
    updateHabitsMutation.mutate({ ...habits, trainingDays: next });
  }

  async function handleLogout() {
    const { refreshToken } = await getTokens();
    if (refreshToken) await authApi.logout(refreshToken).catch(() => null);
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Settings</Text>

      {/* Units */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.row}>
          {["kg", "lb"].map((u) => (
            <TouchableOpacity
              key={u}
              style={[styles.chip, profile?.units === u && styles.chipSelected]}
              onPress={() => updateProfileMutation.mutate({ units: u })}
            >
              <Text style={[styles.chipText, profile?.units === u && styles.chipTextSelected]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Training days */}
      {habits && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Days</Text>
          <View style={styles.daysRow}>
            {DAYS_LABELS.map((label, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.dayBtn, habits.trainingDays?.includes(idx) && styles.dayBtnActive]}
                onPress={() => toggleDay(idx)}
              >
                <Text style={[styles.dayBtnText, habits.trainingDays?.includes(idx) && styles.dayBtnTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Notifications toggle */}
      {habits && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Workout Reminders</Text>
            <Switch
              value={habits.remindersOn}
              onValueChange={(v) => updateHabitsMutation.mutate({ ...habits, remindersOn: v })}
              trackColor={{ true: Colors.primary }}
            />
          </View>
        </View>
      )}

      {/* Danger zone */}
      <View style={[styles.section, styles.dangerSection]}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: handleLogout },
            ])
          }
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 24 },
  section: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: Colors.textPrimary, marginBottom: 12 },
  row: { flexDirection: "row", gap: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.textSecondary, fontWeight: "500" },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  daysRow: { flexDirection: "row", gap: 6 },
  dayBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayBtnText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "500" },
  dayBtnTextActive: { color: "#fff", fontWeight: "700" },
  dangerSection: { borderColor: "#FCA5A5" },
  logoutText: { color: Colors.danger, fontWeight: "600", textAlign: "center", fontSize: 16 },
});

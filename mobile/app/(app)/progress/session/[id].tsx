import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { workoutsApi } from "../../../../src/api/workouts.api";
import { Colors } from "../../../../src/constants/colors";
import { formatDate, formatDuration, formatWeight } from "../../../../src/utils/formatters";
import { useQuery as useProfileQuery } from "@tanstack/react-query";
import { profileApi } from "../../../../src/api/profile.api";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: session, isLoading } = useQuery({
    queryKey: ["history-session", id],
    queryFn: () => workoutsApi.getHistorySession(id!),
    enabled: !!id,
  });
  const { data: profile } = useProfileQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const units = profile?.units ?? "kg";

  if (isLoading || !session) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  const byExercise = new Map<string, { name: string; logs: typeof session.setLogs }>();
  for (const log of (session.setLogs ?? [])) {
    if (!byExercise.has(log.exerciseId)) {
      byExercise.set(log.exerciseId, { name: log.exercise?.name ?? "Exercise", logs: [] });
    }
    byExercise.get(log.exerciseId)!.logs.push(log);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.date}>{formatDate(session.startedAt)}</Text>
      <Text style={styles.name}>{session.workoutTemplate?.name ?? "Workout"}</Text>
      <Text style={styles.meta}>Duration: {formatDuration(session.durationSeconds)}</Text>

      {Array.from(byExercise.values()).map(({ name, logs }) => (
        <View key={name} style={styles.exerciseBlock}>
          <Text style={styles.exerciseName}>{name}</Text>
          {logs.map((log, i) => (
            <Text key={i} style={styles.setLine}>
              Set {log.setNumber}: {formatWeight(log.weight, units)} × {log.reps} reps
              {log.rpe ? ` @ RPE ${log.rpe}` : ""}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  date: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  name: { fontSize: 22, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 4 },
  meta: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  exerciseBlock: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  exerciseName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary, marginBottom: 8 },
  setLine: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
});

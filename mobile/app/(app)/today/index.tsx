import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { workoutsApi } from "../../../src/api/workouts.api";
import { habitsApi } from "../../../src/api/habits.api";
import { progressApi } from "../../../src/api/progress.api";
import { useLlmJob } from "../../../src/hooks/useLlmJob";
import { useWorkoutStore } from "../../../src/store/workoutStore";
import { Colors } from "../../../src/constants/colors";

export default function TodayScreen() {
  const router = useRouter();
  const { postWorkoutLlmJobId } = useWorkoutStore();
  const { data: today, isLoading } = useQuery({ queryKey: ["today"], queryFn: workoutsApi.getToday, refetchOnFocus: true });
  const { data: streak } = useQuery({ queryKey: ["streak"], queryFn: habitsApi.getStreak });
  const { data: summary } = useQuery({ queryKey: ["weekly-summary"], queryFn: progressApi.getWeeklySummary });
  const { data: coachJob } = useLlmJob(postWorkoutLlmJobId);

  async function handleStart() {
    if (today?.type !== "workout") return;
    const session = await workoutsApi.start(today.workoutTemplate.id);
    router.push(`/(app)/today/workout/${session.id}`);
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Today</Text>

      {/* Streak */}
      {streak && streak.currentStreak > 0 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak.currentStreak}-week streak!</Text>
        </View>
      )}

      {/* Weekly progress */}
      {summary && !summary.error && (
        <View style={styles.weekCard}>
          <Text style={styles.weekTitle}>This week</Text>
          <Text style={styles.weekProgress}>
            {summary.completedSessions}/{summary.plannedSessions} workouts complete
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, (summary.completedSessions / Math.max(1, summary.plannedSessions)) * 100)}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* AI Coach message from last workout */}
      {coachJob?.status === "done" && coachJob.outputText && (
        <View style={styles.coachCard}>
          <Text style={styles.coachLabel}>Coach feedback</Text>
          <Text style={styles.coachText}>{coachJob.outputText}</Text>
        </View>
      )}
      {postWorkoutLlmJobId && coachJob?.status !== "done" && coachJob?.status !== "failed" && (
        <View style={styles.coachCard}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.coachLoading}>Your coach is reviewing your workout...</Text>
        </View>
      )}

      {/* Today's workout or rest day */}
      {today?.type === "workout" && (
        <View style={styles.workoutCard}>
          <Text style={styles.workoutPhase}>{today.week?.phase?.replace("_", " ").toUpperCase()}</Text>
          <Text style={styles.workoutName}>{today.workoutTemplate?.name}</Text>
          <Text style={styles.workoutMeta}>
            {today.workoutTemplate?.exercises?.length ?? 0} exercises
          </Text>
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start Workout →</Text>
          </TouchableOpacity>
        </View>
      )}

      {today?.type === "rest_day" && (
        <View style={styles.restCard}>
          <Text style={styles.restIcon}>😴</Text>
          <Text style={styles.restTitle}>Rest Day</Text>
          <Text style={styles.restDesc}>{today.message}</Text>
        </View>
      )}

      {today?.type === "in_progress" && (
        <TouchableOpacity style={styles.resumeBtn} onPress={() => router.push(`/(app)/today/workout/${today.sessionId}`)}>
          <Text style={styles.resumeBtnText}>Resume Workout →</Text>
        </TouchableOpacity>
      )}

      {today?.type === "no_program" && (
        <View style={styles.noProgramCard}>
          <Text style={styles.noProgramText}>No active program. Complete onboarding to get started.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 32, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 20 },
  streakBadge: { backgroundColor: "#FEF3C7", borderRadius: 12, padding: 12, marginBottom: 16 },
  streakText: { color: "#92400E", fontWeight: "600", fontSize: 15 },
  weekCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  weekTitle: { color: Colors.textSecondary, fontSize: 13, marginBottom: 4 },
  weekProgress: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 10 },
  progressBar: { height: 8, backgroundColor: Colors.border, borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  coachCard: { backgroundColor: "#EEF2FF", borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: "row", alignItems: "flex-start", gap: 10 },
  coachLabel: { fontSize: 12, color: Colors.primary, fontWeight: "600", marginBottom: 6 },
  coachText: { color: Colors.textPrimary, fontSize: 15, lineHeight: 22 },
  coachLoading: { color: Colors.primary, marginLeft: 8 },
  workoutCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  workoutPhase: { fontSize: 12, color: Colors.primary, fontWeight: "700", letterSpacing: 1, marginBottom: 6 },
  workoutName: { fontSize: 22, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 4 },
  workoutMeta: { color: Colors.textSecondary, marginBottom: 20 },
  startBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  startBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  restCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 32, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  restIcon: { fontSize: 48, marginBottom: 12 },
  restTitle: { fontSize: 20, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 8 },
  restDesc: { color: Colors.textSecondary, textAlign: "center" },
  resumeBtn: { backgroundColor: Colors.warning, borderRadius: 12, padding: 16, alignItems: "center" },
  resumeBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  noProgramCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  noProgramText: { color: Colors.textSecondary, textAlign: "center" },
});

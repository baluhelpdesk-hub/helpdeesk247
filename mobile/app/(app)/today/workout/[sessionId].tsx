import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { workoutsApi } from "../../../../src/api/workouts.api";
import { useRestTimer } from "../../../../src/hooks/useRestTimer";
import { Colors } from "../../../../src/constants/colors";

interface SetEntry {
  weight: string;
  reps: string;
  rpe: string;
  saved: boolean;
  setLogId?: string;
}

export default function ActiveWorkoutScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { seconds: timerSeconds, isRunning: timerRunning, start: startTimer } = useRestTimer(90);
  const [setsByExercise, setSetsByExercise] = useState<Record<string, SetEntry[]>>({});

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => workoutsApi.getSession(sessionId!),
    enabled: !!sessionId,
  });

  const logSetMutation = useMutation({
    mutationFn: ({ exerciseId, setEntry, setNumber }: { exerciseId: string; setEntry: SetEntry; setNumber: number }) =>
      workoutsApi.logSet(sessionId!, {
        exerciseId,
        setNumber,
        weight: parseFloat(setEntry.weight) || null,
        reps: parseInt(setEntry.reps) || null,
        rpe: parseFloat(setEntry.rpe) || null,
      }),
    onSuccess: (data, { exerciseId, setNumber }) => {
      setSetsByExercise((prev) => {
        const sets = [...(prev[exerciseId] ?? [])];
        sets[setNumber - 1] = { ...sets[setNumber - 1], saved: true, setLogId: data.id };
        return { ...prev, [exerciseId]: sets };
      });
      startTimer();
    },
  });

  function addSet(exerciseId: string) {
    setSetsByExercise((prev) => ({
      ...prev,
      [exerciseId]: [...(prev[exerciseId] ?? []), { weight: "", reps: "", rpe: "", saved: false }],
    }));
  }

  function updateSet(exerciseId: string, index: number, field: keyof SetEntry, value: string) {
    setSetsByExercise((prev) => {
      const sets = [...(prev[exerciseId] ?? [])];
      sets[index] = { ...sets[index], [field]: value };
      return { ...prev, [exerciseId]: sets };
    });
  }

  function saveSet(exerciseId: string, index: number) {
    const setEntry = setsByExercise[exerciseId]?.[index];
    if (!setEntry || (!setEntry.weight && !setEntry.reps)) {
      Alert.alert("Enter weight and reps first");
      return;
    }
    logSetMutation.mutate({ exerciseId, setEntry, setNumber: index + 1 });
  }

  if (isLoading || !session) {
    return <View style={styles.loading}><Text>Loading workout...</Text></View>;
  }

  const exercises = session.workoutTemplate?.exercises ?? [];

  return (
    <View style={styles.container}>
      {/* Rest timer */}
      {timerRunning && (
        <View style={styles.timerBar}>
          <Text style={styles.timerText}>Rest: {timerSeconds}s</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.workoutName}>{session.workoutTemplate?.name ?? "Workout"}</Text>

        {exercises.map((slot: { exercise: { id: string; name: string }; sets: number; repsMin: number; repsMax: number; suggestion?: { suggestedWeightKg: number | null } }) => {
          const exId = slot.exercise.id;
          const sets = setsByExercise[exId] ?? [];

          return (
            <View key={exId} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{slot.exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {slot.sets} × {slot.repsMin}–{slot.repsMax} reps
                {slot.suggestion?.suggestedWeightKg ? ` · Target: ${slot.suggestion.suggestedWeightKg}kg` : ""}
              </Text>

              {sets.map((s, idx) => (
                <View key={idx} style={[styles.setRow, s.saved && styles.setRowSaved]}>
                  <Text style={styles.setNum}>{idx + 1}</Text>
                  <TextInput
                    style={styles.setInput}
                    placeholder="kg"
                    value={s.weight}
                    onChangeText={(v) => updateSet(exId, idx, "weight", v)}
                    keyboardType="decimal-pad"
                    editable={!s.saved}
                  />
                  <TextInput
                    style={styles.setInput}
                    placeholder="reps"
                    value={s.reps}
                    onChangeText={(v) => updateSet(exId, idx, "reps", v)}
                    keyboardType="number-pad"
                    editable={!s.saved}
                  />
                  {!s.saved ? (
                    <TouchableOpacity style={styles.saveSetBtn} onPress={() => saveSet(exId, idx)}>
                      <Text style={styles.saveSetBtnText}>✓</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.savedCheck}>✓</Text>
                  )}
                </View>
              ))}

              <TouchableOpacity style={styles.addSetBtn} onPress={() => addSet(exId)}>
                <Text style={styles.addSetBtnText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.finishBtn}
        onPress={() => router.push(`/(app)/today/workout/finish?sessionId=${sessionId}`)}
      >
        <Text style={styles.finishBtnText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  timerBar: { backgroundColor: Colors.primary, padding: 12, alignItems: "center" },
  timerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  workoutName: { fontSize: 22, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 20 },
  exerciseCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  exerciseName: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginBottom: 4 },
  exerciseMeta: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  setRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8, padding: 8, borderRadius: 8, backgroundColor: Colors.background },
  setRowSaved: { backgroundColor: "#F0FDF4" },
  setNum: { width: 20, textAlign: "center", color: Colors.textMuted, fontWeight: "600" },
  setInput: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 8, fontSize: 15, backgroundColor: Colors.surface, textAlign: "center" },
  saveSetBtn: { backgroundColor: Colors.primary, borderRadius: 8, width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  saveSetBtnText: { color: "#fff", fontWeight: "bold" },
  savedCheck: { color: Colors.success, fontWeight: "bold", fontSize: 18, width: 36, textAlign: "center" },
  addSetBtn: { marginTop: 4, padding: 8, alignItems: "center", borderWidth: 1, borderColor: Colors.border, borderRadius: 8, borderStyle: "dashed" },
  addSetBtnText: { color: Colors.primary, fontWeight: "600" },
  finishBtn: { position: "absolute", bottom: 20, left: 20, right: 20, backgroundColor: Colors.success, borderRadius: 14, padding: 18, alignItems: "center" },
  finishBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});

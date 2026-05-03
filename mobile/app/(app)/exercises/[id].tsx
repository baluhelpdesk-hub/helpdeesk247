import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { exercisesApi } from "../../../src/api/exercises.api";
import { useLlmJob } from "../../../src/hooks/useLlmJob";
import { Colors } from "../../../src/constants/colors";
import { useState } from "react";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cuesJobId, setCuesJobId] = useState<string | null>(null);

  const { data: exercise, isLoading } = useQuery({
    queryKey: ["exercise", id],
    queryFn: () => exercisesApi.get(id!),
    enabled: !!id,
  });

  const { data: cuesJob } = useLlmJob(cuesJobId);

  async function handleGetCues() {
    const result = await exercisesApi.getCues(id!);
    if (result.cues) return; // already shown via exercise.cuesCache
    if (result.jobId) setCuesJobId(result.jobId);
  }

  if (isLoading || !exercise) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  const cachedCues = exercise.cuesCache ? JSON.parse(exercise.cuesCache.cues) as string[] : null;
  const liveCues = cuesJob?.status === "done" && cuesJob.outputText
    ? (() => { try { return JSON.parse(cuesJob.outputText) as string[]; } catch { return [cuesJob.outputText]; } })()
    : null;
  const cues = cachedCues ?? liveCues;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.meta}>
        {exercise.primaryMuscles?.join(", ")} · {exercise.difficulty}
      </Text>

      <Text style={styles.sectionTitle}>Instructions</Text>
      {exercise.instructions?.map((step: string, i: number) => (
        <Text key={i} style={styles.step}>{i + 1}. {step}</Text>
      ))}

      <Text style={styles.sectionTitle}>Common Mistakes</Text>
      {exercise.commonMistakes?.map((m: string, i: number) => (
        <Text key={i} style={styles.mistake}>⚠️ {m}</Text>
      ))}

      {cues ? (
        <>
          <Text style={styles.sectionTitle}>Coaching Cues</Text>
          {cues.map((cue: string, i: number) => (
            <View key={i} style={styles.cueRow}>
              <Text style={styles.cueDot}>•</Text>
              <Text style={styles.cueText}>{cue}</Text>
            </View>
          ))}
        </>
      ) : (
        <View>
          {cuesJobId && cuesJob?.status !== "done" ? (
            <View style={styles.cuesLoading}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.cuesLoadingText}>Getting coaching cues...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.cuesBtn} onPress={handleGetCues}>
              <Text style={styles.cuesBtnText}>✨ Get AI Coaching Cues</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  name: { fontSize: 24, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 6 },
  meta: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.textPrimary, marginTop: 20, marginBottom: 10 },
  step: { fontSize: 15, color: Colors.textPrimary, marginBottom: 8, lineHeight: 22 },
  mistake: { fontSize: 14, color: "#B91C1C", marginBottom: 6 },
  cueRow: { flexDirection: "row", marginBottom: 8 },
  cueDot: { color: Colors.primary, fontSize: 18, marginRight: 8, marginTop: 2 },
  cueText: { flex: 1, fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  cuesBtn: { backgroundColor: "#EEF2FF", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 20, borderWidth: 1, borderColor: Colors.primary },
  cuesBtnText: { color: Colors.primary, fontWeight: "600", fontSize: 15 },
  cuesLoading: { flexDirection: "row", alignItems: "center", marginTop: 20, gap: 10 },
  cuesLoadingText: { color: Colors.primary },
});

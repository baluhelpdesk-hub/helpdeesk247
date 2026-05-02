import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { workoutsApi } from "../../../../src/api/workouts.api";
import { useWorkoutStore } from "../../../../src/store/workoutStore";
import { useQueryClient } from "@tanstack/react-query";
import { Colors } from "../../../../src/constants/colors";

const FEEL_OPTIONS = [
  { value: "easy", label: "Easy", color: Colors.success },
  { value: "just_right", label: "Just Right", color: Colors.primary },
  { value: "too_hard", label: "Too Hard", color: Colors.danger },
];

const RPE_OPTIONS = [5, 6, 7, 8, 9, 10];

export default function FinishWorkoutScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setPostWorkoutLlmJobId } = useWorkoutStore();
  const [feel, setFeel] = useState<string | null>(null);
  const [overallRpe, setOverallRpe] = useState<number | null>(null);
  const [hasPain, setHasPain] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    try {
      const result = await workoutsApi.finish(sessionId!, {
        feelRating: feel,
        overallRpe,
        hasPain: hasPain ?? false,
        notes,
      });
      setPostWorkoutLlmJobId(result.llmJobId);
      await queryClient.invalidateQueries({ queryKey: ["today"] });
      await queryClient.invalidateQueries({ queryKey: ["weekly-summary"] });
      router.replace("/(app)/today");
    } catch {
      Alert.alert("Error", "Failed to save workout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How was your workout?</Text>

      <Text style={styles.label}>Overall feel</Text>
      <View style={styles.row}>
        {FEEL_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.feelBtn, { borderColor: opt.color }, feel === opt.value && { backgroundColor: opt.color }]}
            onPress={() => setFeel(opt.value)}
          >
            <Text style={[styles.feelBtnText, feel === opt.value && { color: "#fff" }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Overall effort (RPE)</Text>
      <View style={styles.row}>
        {RPE_OPTIONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.rpeBtn, overallRpe === r && styles.rpeBtnSelected]}
            onPress={() => setOverallRpe(r)}
          >
            <Text style={[styles.rpeBtnText, overallRpe === r && styles.rpeBtnTextSelected]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Any pain or discomfort?</Text>
      <View style={styles.row}>
        {[{ val: false, label: "No" }, { val: true, label: "Yes" }].map(({ val, label }) => (
          <TouchableOpacity
            key={String(val)}
            style={[styles.painBtn, hasPain === val && styles.painBtnSelected]}
            onPress={() => setHasPain(val)}
          >
            <Text style={[styles.painBtnText, hasPain === val && styles.painBtnTextSelected]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Anything to remember for next time?"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity style={styles.finishBtn} onPress={handleFinish} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.finishBtnText}>Complete Workout ✓</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 24 },
  label: { fontSize: 15, fontWeight: "600", color: Colors.textPrimary, marginBottom: 10, marginTop: 20 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  feelBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 2, alignItems: "center", minWidth: 90 },
  feelBtnText: { fontWeight: "600", color: Colors.textPrimary },
  rpeBtn: { width: 44, height: 44, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center", backgroundColor: Colors.surface },
  rpeBtnSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rpeBtnText: { fontWeight: "600", color: Colors.textPrimary },
  rpeBtnTextSelected: { color: "#fff" },
  painBtn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  painBtnSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  painBtnText: { fontWeight: "600", color: Colors.textPrimary },
  painBtnTextSelected: { color: "#fff" },
  notesInput: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 80, textAlignVertical: "top" },
  finishBtn: { backgroundColor: Colors.success, borderRadius: 14, padding: 18, alignItems: "center", marginTop: 32 },
  finishBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});

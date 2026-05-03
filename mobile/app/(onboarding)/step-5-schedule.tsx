import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { Colors } from "../../src/constants/colors";

const DAYS_OPTIONS = [2, 3, 4, 5];
const MINUTES_OPTIONS = [30, 45, 60];

export default function Step5() {
  const { data, setField } = useOnboardingStore();
  const router = useRouter();
  const canContinue = !!data.daysPerWeek && !!data.minutesPerSession;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 5 of 5</Text>
      <Text style={styles.title}>Your schedule</Text>

      <Text style={styles.label}>Days per week</Text>
      <View style={styles.row}>
        {DAYS_OPTIONS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.numChip, data.daysPerWeek === d && styles.numChipSelected]}
            onPress={() => setField("daysPerWeek", d)}
          >
            <Text style={[styles.numText, data.daysPerWeek === d && styles.numTextSelected]}>{d} days</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Minutes per session</Text>
      <View style={styles.row}>
        {MINUTES_OPTIONS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.numChip, data.minutesPerSession === m && styles.numChipSelected]}
            onPress={() => setField("minutesPerSession", m)}
          >
            <Text style={[styles.numText, data.minutesPerSession === m && styles.numTextSelected]}>{m} min</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚕️ This app is not medical advice. If you have heart, joint, or serious health issues, consult a doctor before starting any exercise program.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, !canContinue && styles.nextBtnDisabled]}
        disabled={!canContinue}
        onPress={() => router.push("/(onboarding)/complete")}
      >
        <Text style={styles.nextBtnText}>Accept & Create My Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: Colors.background },
  step: { color: Colors.textMuted, fontSize: 14, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 10, marginTop: 16 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  numChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  numChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  numText: { fontSize: 15, color: Colors.textSecondary },
  numTextSelected: { color: "#fff", fontWeight: "600" },
  disclaimer: { backgroundColor: "#FEF3C7", borderRadius: 12, padding: 14, marginTop: 24 },
  disclaimerText: { color: "#92400E", fontSize: 13, lineHeight: 20 },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  nextBtnDisabled: { backgroundColor: Colors.textMuted },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

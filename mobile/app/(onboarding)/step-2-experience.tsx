import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { Colors } from "../../src/constants/colors";

const EXP_OPTIONS = [
  { value: "new", label: "New to training", desc: "Never trained or less than 3 months" },
  { value: "some", label: "Some experience", desc: "3–12 months of training" },
  { value: "regular", label: "Regular trainer", desc: "1+ year of consistent training" },
];

export default function Step2() {
  const { data, setField } = useOnboardingStore();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 2 of 5</Text>
      <Text style={styles.title}>Training experience</Text>
      <Text style={styles.subtitle}>This helps us choose the right program intensity for you.</Text>

      {EXP_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.card, data.trainingExp === opt.value && styles.cardSelected]}
          onPress={() => setField("trainingExp", opt.value)}
        >
          <Text style={[styles.cardTitle, data.trainingExp === opt.value && styles.cardTitleSelected]}>{opt.label}</Text>
          <Text style={[styles.cardDesc, data.trainingExp === opt.value && styles.cardDescSelected]}>{opt.desc}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextBtn, !data.trainingExp && styles.nextBtnDisabled]}
        disabled={!data.trainingExp}
        onPress={() => router.push("/(onboarding)/step-3-goal")}
      >
        <Text style={styles.nextBtnText}>Next →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: Colors.background },
  step: { color: Colors.textMuted, fontSize: 14, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { color: Colors.textSecondary, marginBottom: 24, fontSize: 14 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: Colors.border },
  cardSelected: { borderColor: Colors.primary, backgroundColor: "#EEF2FF" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 4 },
  cardTitleSelected: { color: Colors.primary },
  cardDesc: { fontSize: 14, color: Colors.textSecondary },
  cardDescSelected: { color: Colors.primary },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  nextBtnDisabled: { backgroundColor: Colors.textMuted },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

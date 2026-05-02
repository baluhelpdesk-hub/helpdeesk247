import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { Colors } from "../../src/constants/colors";

const AGE_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55+"];
const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function Step1() {
  const { data, setField } = useOnboardingStore();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 1 of 5</Text>
      <Text style={styles.title}>About you</Text>

      <Text style={styles.label}>Age range</Text>
      <View style={styles.optionRow}>
        {AGE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, data.ageRange === opt && styles.chipSelected]}
            onPress={() => setField("ageRange", opt)}
          >
            <Text style={[styles.chipText, data.ageRange === opt && styles.chipTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Sex</Text>
      <View style={styles.optionColumn}>
        {SEX_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionBtn, data.sex === opt.value && styles.optionBtnSelected]}
            onPress={() => setField("sex", opt.value)}
          >
            <Text style={[styles.optionBtnText, data.sex === opt.value && styles.optionBtnTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, (!data.ageRange || !data.sex) && styles.nextBtnDisabled]}
        disabled={!data.ageRange || !data.sex}
        onPress={() => router.push("/(onboarding)/step-2-experience")}
      >
        <Text style={styles.nextBtnText}>Next →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: Colors.background },
  step: { color: Colors.textMuted, fontSize: 14, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: "bold", color: Colors.textPrimary, marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 10, marginTop: 16 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.textSecondary },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  optionColumn: { gap: 8 },
  optionBtn: { padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  optionBtnSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionBtnText: { color: Colors.textSecondary, fontSize: 16 },
  optionBtnTextSelected: { color: "#fff", fontWeight: "600" },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 32 },
  nextBtnDisabled: { backgroundColor: Colors.textMuted },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

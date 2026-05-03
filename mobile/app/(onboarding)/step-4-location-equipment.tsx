import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { Colors } from "../../src/constants/colors";

const LOCATION_OPTIONS = [
  { value: "gym", label: "Gym", desc: "I train at a commercial or home gym" },
  { value: "home", label: "Home", desc: "I train at home with limited equipment" },
  { value: "both", label: "Both", desc: "I sometimes train at home and at the gym" },
];

const EQUIPMENT = [
  { value: "barbell", label: "Barbell" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "bench", label: "Bench" },
  { value: "cable_machine", label: "Cables" },
  { value: "pull_up_bar", label: "Pull-up bar" },
  { value: "resistance_band", label: "Resistance bands" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "bodyweight", label: "Bodyweight only" },
];

export default function Step4() {
  const { data, setField } = useOnboardingStore();
  const router = useRouter();
  const equipment = data.equipment ?? [];

  function toggleEquipment(val: string) {
    if (equipment.includes(val)) {
      setField("equipment", equipment.filter((e) => e !== val));
    } else {
      setField("equipment", [...equipment, val]);
    }
  }

  const canContinue = !!data.location && equipment.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 4 of 5</Text>
      <Text style={styles.title}>Where do you train?</Text>

      {LOCATION_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.card, data.location === opt.value && styles.cardSelected]}
          onPress={() => setField("location", opt.value)}
        >
          <Text style={[styles.cardTitle, data.location === opt.value && styles.cardTitleSelected]}>{opt.label}</Text>
          <Text style={styles.cardDesc}>{opt.desc}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Available equipment</Text>
      <View style={styles.equipmentGrid}>
        {EQUIPMENT.map((eq) => (
          <TouchableOpacity
            key={eq.value}
            style={[styles.eqChip, equipment.includes(eq.value) && styles.eqChipSelected]}
            onPress={() => toggleEquipment(eq.value)}
          >
            <Text style={[styles.eqText, equipment.includes(eq.value) && styles.eqTextSelected]}>{eq.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, !canContinue && styles.nextBtnDisabled]}
        disabled={!canContinue}
        onPress={() => router.push("/(onboarding)/step-5-schedule")}
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
  label: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 10, marginTop: 20 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: Colors.border },
  cardSelected: { borderColor: Colors.primary, backgroundColor: "#EEF2FF" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 2 },
  cardTitleSelected: { color: Colors.primary },
  cardDesc: { fontSize: 13, color: Colors.textSecondary },
  equipmentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  eqChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  eqChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  eqText: { color: Colors.textSecondary, fontSize: 14 },
  eqTextSelected: { color: "#fff", fontWeight: "600" },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 32 },
  nextBtnDisabled: { backgroundColor: Colors.textMuted },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

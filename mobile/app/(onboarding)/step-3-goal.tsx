import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "../../src/store/onboardingStore";
import { Colors } from "../../src/constants/colors";

const GOALS = [
  { value: "build_muscle", label: "Build Muscle", icon: "💪", desc: "Gain size and strength" },
  { value: "lose_fat", label: "Lose Fat", icon: "🔥", desc: "Burn fat and improve body composition" },
  { value: "get_stronger", label: "Get Stronger", icon: "🏋️", desc: "Increase strength on key lifts" },
  { value: "general_fitness", label: "General Fitness", icon: "⚡", desc: "Stay healthy and feel great" },
];

export default function Step3() {
  const { data, setField } = useOnboardingStore();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Step 3 of 5</Text>
      <Text style={styles.title}>Your primary goal</Text>

      {GOALS.map((g) => (
        <TouchableOpacity
          key={g.value}
          style={[styles.card, data.goal === g.value && styles.cardSelected]}
          onPress={() => setField("goal", g.value)}
        >
          <Text style={styles.icon}>{g.icon}</Text>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, data.goal === g.value && styles.cardTitleSelected]}>{g.label}</Text>
            <Text style={styles.cardDesc}>{g.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextBtn, !data.goal && styles.nextBtnDisabled]}
        disabled={!data.goal}
        onPress={() => router.push("/(onboarding)/step-4-location-equipment")}
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
  card: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: Colors.border },
  cardSelected: { borderColor: Colors.primary, backgroundColor: "#EEF2FF" },
  icon: { fontSize: 28, marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 2 },
  cardTitleSelected: { color: Colors.primary },
  cardDesc: { fontSize: 13, color: Colors.textSecondary },
  nextBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 },
  nextBtnDisabled: { backgroundColor: Colors.textMuted },
  nextBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

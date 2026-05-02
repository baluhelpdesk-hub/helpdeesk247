import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { progressApi } from "../../../src/api/progress.api";
import { workoutsApi } from "../../../src/api/workouts.api";
import { Colors } from "../../../src/constants/colors";
import { formatDate } from "../../../src/utils/formatters";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProgressScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "history">("overview");

  const { data: weeklyData } = useQuery({ queryKey: ["workouts-per-week"], queryFn: () => progressApi.getWorkoutsPerWeek(12) });
  const { data: historyData, isLoading: historyLoading } = useQuery({ queryKey: ["history"], queryFn: () => workoutsApi.getHistory() });

  const maxCount = weeklyData ? Math.max(...weeklyData.map((d: { count: number }) => d.count), 1) : 1;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Progress</Text>

      <View style={styles.tabs}>
        {["overview", "history"].map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t as "overview" | "history")}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "overview" && (
        <ScrollView contentContainerStyle={styles.overviewContent}>
          <Text style={styles.sectionTitle}>Workouts per week (last 12 weeks)</Text>
          {weeklyData && (
            <View style={styles.barChart}>
              {weeklyData.map((d: { weekStart: string; count: number }) => (
                <View key={d.weekStart} style={styles.barContainer}>
                  <View style={[styles.bar, { height: Math.max(4, (d.count / maxCount) * 80) }]} />
                  <Text style={styles.barLabel}>{d.count}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {tab === "history" && (
        <View style={styles.historyContainer}>
          {historyLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={historyData?.sessions ?? []}
              keyExtractor={(item: { id: string }) => item.id}
              renderItem={({ item }: { item: { id: string; completedAt: string; workoutTemplate?: { name: string } } }) => (
                <TouchableOpacity style={styles.historyItem} onPress={() => router.push(`/(app)/progress/session/${item.id}`)}>
                  <Text style={styles.historyDate}>{formatDate(item.completedAt)}</Text>
                  <Text style={styles.historyName}>{item.workoutTemplate?.name ?? "Workout"}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ padding: 16 }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary, padding: 20, paddingBottom: 12 },
  tabs: { flexDirection: "row", marginHorizontal: 16, marginBottom: 8, backgroundColor: Colors.border, borderRadius: 10, padding: 3 },
  tab: { flex: 1, padding: 8, alignItems: "center", borderRadius: 8 },
  tabActive: { backgroundColor: Colors.surface },
  tabText: { color: Colors.textSecondary, fontWeight: "500" },
  tabTextActive: { color: Colors.primary, fontWeight: "700" },
  overviewContent: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 16 },
  barChart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 120, backgroundColor: Colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.border },
  barContainer: { flex: 1, alignItems: "center", gap: 4 },
  bar: { width: "60%", backgroundColor: Colors.primary, borderRadius: 4 },
  barLabel: { fontSize: 10, color: Colors.textMuted },
  historyContainer: { flex: 1 },
  historyItem: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  historyDate: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  historyName: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
});

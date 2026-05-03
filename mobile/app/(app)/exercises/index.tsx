import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { exercisesApi } from "../../../src/api/exercises.api";
import { Colors } from "../../../src/constants/colors";

export default function ExerciseListScreen() {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");
  const router = useRouter();

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["exercises", muscleFilter],
    queryFn: () => exercisesApi.list({ muscles: muscleFilter || undefined }),
  });

  const filtered = (exercises ?? []).filter((e: { name: string }) =>
    !search || e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exercise Library</Text>
      <TextInput
        style={styles.search}
        placeholder="Search exercises..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item: { id: string }) => item.id}
        renderItem={({ item }: { item: { id: string; name: string; primaryMuscles: string[]; equipment: string[]; difficulty: string } }) => (
          <TouchableOpacity style={styles.item} onPress={() => router.push(`/(app)/exercises/${item.id}`)}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>
              {item.primaryMuscles.join(", ")} · {item.difficulty}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 28, fontWeight: "bold", color: Colors.textPrimary, padding: 20, paddingBottom: 12 },
  search: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12, fontSize: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  item: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  itemName: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary, marginBottom: 4 },
  itemMeta: { fontSize: 13, color: Colors.textSecondary },
});

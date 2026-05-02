import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Link } from "expo-router";
import { authApi } from "../../src/api/auth.api";
import { Colors } from "../../src/constants/colors";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!email || !password) { Alert.alert("Error", "Please fill in all fields"); return; }
    if (password.length < 8) { Alert.alert("Error", "Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await authApi.register(email, password);
      Alert.alert("Account created!", "Please log in with your new account", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      Alert.alert("Registration failed", msg ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join AI Fitness Coach today</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password (8+ characters)" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" style={styles.link}>Log in</Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.primary, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: "center", marginBottom: 32 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: Colors.primary },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  footerText: { color: Colors.textSecondary },
});

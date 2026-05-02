import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Link } from "expo-router";
import { authApi } from "../../src/api/auth.api";
import { useAuthStore } from "../../src/store/authStore";
import { Colors } from "../../src/constants/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setTokens } = useAuthStore();
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      await setTokens(data.accessToken, data.refreshToken, data.user.id);
      router.replace("/(app)/today");
    } catch {
      Alert.alert("Login failed", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.title}>AI Fitness Coach</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <Link href="/(auth)/forgot-password" style={styles.link}>Forgot password?</Link>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/(auth)/register" style={styles.link}>Sign up</Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: Colors.background },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.primary, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: "center", marginBottom: 32 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { color: Colors.primary, textAlign: "center", marginTop: 16 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  footerText: { color: Colors.textSecondary },
});

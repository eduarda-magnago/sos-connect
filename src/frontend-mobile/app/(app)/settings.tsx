import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { colors, fonts, radius, spacing } from "../../constants/theme";

const roleLabel: Record<string, string> = {
  victim: "Usuário Comum",
  volunteer: "Voluntário(a)",
  support_unit: "Instituição",
  admin: "Administrador",
};

export default function Settings() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    const payload: { name?: string; email?: string; password?: string } = {};
    if (name !== user?.name) payload.name = name;
    if (email !== user?.email) payload.email = email;
    if (password.length >= 6) payload.password = password;

    if (Object.keys(payload).length === 0 && !avatarUri) {
      Alert.alert("Atenção", "Nenhuma alteração detectada.");
      return;
    }

    setLoading(true);
    try {
      if (Object.keys(payload).length > 0) {
        await api.put(`/users/${user?._id}`, payload);
      }

      if (avatarUri) {
        const formData = new FormData();
        formData.append("avatar", {
          uri: avatarUri,
          type: "image/jpeg",
          name: "avatar.jpg",
        } as any);
        await api.post(`/users/${user?._id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      Alert.alert("✓ Sucesso", "Configurações salvas com sucesso!");
      setPassword("");
    } catch (error: any) {
      console.log(
        "Erro ao salvar:",
        error?.response?.status,
        error?.response?.data,
        error?.message,
      );
      Alert.alert("Erro", "Não foi possível salvar as configurações.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: logout,
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: "Configurações" }} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.avatarContainer}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={36} color={colors.muted} />
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileRole}>
                {roleLabel[user?.role || ""]}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações pessoais</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@gmail.com"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nova senha</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    elevation: 2,
  },

  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.action,
    justifyContent: "center",
    alignItems: "center",
  },

  profileName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
  },

  profileRole: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },

  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    elevation: 2,
    gap: spacing.sm,
  },

  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },

  field: {
    gap: 4,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.foreground,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.background,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: spacing.xs,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: "#fff",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },

  logoutText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.danger,
  },

  bottomSpace: {
    height: 32,
  },
});

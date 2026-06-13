import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
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

import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { getMediaUrl } from "../../services/media";
import { pickAndUploadImage } from "../../services/upload";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import {
  confirmFeedback,
  showError,
  showSuccess,
  showWarning,
} from "../../components/ui/FeedbackProvider";

const roleLabel: Record<string, string> = {
  victim: "Usuário comum",
  volunteer: "Voluntário(a)",
  support_unit: "Instituição",
  admin: "Administrador",
};

export default function Settings() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUri(getMediaUrl(user.avatar));
      setAvatarChanged(false);
    }
  }, [user]);

  async function handlePickImage() {
    setAvatarLoading(true);

    try {
      const url = await pickAndUploadImage("avatars", { aspect: [1, 1] });

      if (url) {
        setAvatarUri(url);
        setAvatarChanged(true);
      }
    } catch (error: any) {
      showError(
        "Não foi possível enviar a foto",
        error.message || "Tente novamente em alguns instantes ou escolha outra imagem.",
      );
    } finally {
      setAvatarLoading(false);
    }
  }

  async function handleSave() {
    const payload: {
      name?: string;
      email?: string;
      password?: string;
      avatar?: string;
    } = {};

    if (name !== user?.name) payload.name = name;
    if (email !== user?.email) payload.email = email;
    if (password.length >= 6) payload.password = password;
    if (avatarChanged && avatarUri) payload.avatar = avatarUri;

    if (Object.keys(payload).length === 0) {
      showWarning(
        "Nada para salvar",
        "Faça alguma alteração no perfil antes de tocar em salvar.",
      );
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/users/${user?._id}`, payload);
      await updateUser(response.data);

      showSuccess("Perfil atualizado", "Suas informações foram salvas com segurança.");
      setPassword("");
      setAvatarChanged(false);
    } catch (error: any) {
      console.log(
        "Erro ao salvar:",
        error?.response?.status,
        error?.response?.data,
        error?.message,
      );
      showError("Não foi possível salvar", "Verifique os dados informados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    confirmFeedback({
      title: "Sair da conta?",
      message: "Você precisará entrar novamente para acessar seu perfil e suas unidades.",
      confirmText: "Sair",
      onConfirm: logout,
    });
  }

  return (
    <>
      <Stack.Screen options={{ title: "Perfil" }} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.avatarContainer}
              disabled={avatarLoading}
              activeOpacity={0.82}
            >
              {avatarLoading ? (
                <Ionicons name="cloud-upload-outline" size={32} color={colors.muted} />
              ) : avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={36} color={colors.muted} />
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.profileText}>
              <Text style={styles.profileName} numberOfLines={1}>{user?.name}</Text>
              <Text style={styles.profileRole}>
                {roleLabel[user?.role || ""]}
              </Text>
            </View>
            </View>

            <View style={styles.sectionDivider} />
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
                placeholder="********"
                placeholderTextColor={colors.muted}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.86}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </Text>
            </TouchableOpacity>
            <View style={styles.sectionDivider} />

            <Text style={styles.sectionTitle}>Conta</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.82}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
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

  content: {
    paddingBottom: 112,
  },

  profileCard: {
    gap: spacing.md,
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  avatarContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },

  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: colors.action,
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    flex: 1,
    minWidth: 0,
  },

  profileName: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.foreground,
  },

  profileRole: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },

  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },

  field: {
    gap: 5,
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
    paddingVertical: 11,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.foreground,
    backgroundColor: colors.background,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
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
    minHeight: 44,
    paddingVertical: spacing.sm,
  },

  logoutText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.danger,
  },
});

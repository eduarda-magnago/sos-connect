import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts, radius, spacing } from "../../constants/theme";

type UserRole = "victim" | "volunteer" | "support_unit" | "admin";

type UnitRoleActionsProps = {
  role?: UserRole;
  isOwner?: boolean;
  onRoutePress: () => void;
  onAskHelpPress: () => void;
  onVolunteerPress: () => void;
  onEditPress: () => void;
  onDonationsPress: () => void;
  onMissionsPress: () => void;
  onApprovePress: () => void;
};

type ActionButtonProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "default" | "primary";
  testID?: string;
};

export function UnitRoleActions({
  role,
  isOwner = false,
  onRoutePress,
  onAskHelpPress,
  onVolunteerPress,
  onEditPress,
  onDonationsPress,
  onMissionsPress,
  onApprovePress,
}: UnitRoleActionsProps) {
  return (
    <View style={styles.card}>
      <View style={styles.actions}>
        {role === "victim" && (
          <>
            <ActionButton title="Ver rota" icon="navigate-outline" onPress={onRoutePress} />
            <ActionButton
              title="Pedir ajuda"
              icon="heart-outline"
              onPress={onAskHelpPress}
              variant="primary"
            />
          </>
        )}

        {role === "volunteer" && (
          <>
            <ActionButton
              title="Ver doações"
              icon="gift-outline"
              onPress={onDonationsPress}
              testID="unit-btn-donations"
            />
            <ActionButton
              title="Participar de missão"
              icon="flag-outline"
              onPress={onVolunteerPress}
              testID="unit-btn-missions"
            />
            <ActionButton
              title="Ver rota"
              icon="navigate-outline"
              onPress={onRoutePress}
              variant="primary"
              testID="unit-btn-route"
            />
          </>
        )}

        {role === "support_unit" && isOwner && (
          <>
            <ActionButton title="Editar unidade" icon="create-outline" onPress={onEditPress} />
            <ActionButton
              title="Gerenciar doações"
              icon="gift-outline"
              onPress={onDonationsPress}
            />
            <ActionButton
              title="Gerenciar missões"
              icon="flag-outline"
              onPress={onMissionsPress}
              variant="primary"
            />
          </>
        )}

        {role === "support_unit" && !isOwner && (
          <>
            <ActionButton title="Ver rota" icon="navigate-outline" onPress={onRoutePress} />
            <ActionButton
              title="Visualizar informações"
              icon="information-circle-outline"
              onPress={onAskHelpPress}
              variant="primary"
            />
          </>
        )}

        {role === "admin" && (
          <>
            <ActionButton title="Editar unidade" icon="create-outline" onPress={onEditPress} />
            <ActionButton
              title="Validar unidade"
              icon="shield-checkmark-outline"
              onPress={onApprovePress}
              variant="primary"
            />
          </>
        )}
      </View>
    </View>
  );
}

function ActionButton({
  title,
  icon,
  onPress,
  variant = "default",
  testID,
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[styles.button, isPrimary && styles.primaryButton]}
      onPress={onPress}
      activeOpacity={0.85}
      testID={testID}
    >
      <Ionicons
        name={icon}
        size={18}
        color={isPrimary ? "#fff" : colors.primary}
      />
      <Text style={[styles.buttonText, isPrimary && styles.primaryButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    gap: spacing.md,
  },

  actions: {
    gap: spacing.sm,
  },

  button: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.background,
  },

  primaryButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  buttonText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.foreground,
  },

  primaryButtonText: {
    color: "#fff",
  },
});

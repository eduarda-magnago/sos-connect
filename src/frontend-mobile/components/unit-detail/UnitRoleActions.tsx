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
    <View style={styles.container}>
      {role === "victim" && (
        <>
          <ActionButton title="Ver rota" onPress={onRoutePress} />
          <ActionButton
            title="Pedir ajuda"
            onPress={onAskHelpPress}
            variant="primary"
          />
        </>
      )}

      {role === "volunteer" && (
        <>
          <ActionButton title="Ver doações" onPress={onDonationsPress} />
          <ActionButton
            title="Participe de uma Missão de ajuda"
            onPress={onVolunteerPress}
          />
          <ActionButton
            title="Ver rota"
            onPress={onRoutePress}
            variant="primary"
          />
        </>
      )}

      {role === "support_unit" && isOwner && (
        <>
          <ActionButton title="Editar unidade" onPress={onEditPress} />
          <ActionButton title="Gerenciar doações" onPress={onDonationsPress} />
          <ActionButton
            title="Gerenciar missões"
            onPress={onMissionsPress}
            variant="primary"
          />
        </>
      )}

      {role === "support_unit" && !isOwner && (
        <>
          <ActionButton title="Ver rota" onPress={onRoutePress} />
          <ActionButton
            title="Visualizar informações"
            onPress={onAskHelpPress}
            variant="primary"
          />
        </>
      )}

      {role === "admin" && (
        <>
          <ActionButton title="Editar unidade" onPress={onEditPress} />
          <ActionButton
            title="Aprovar / validar unidade"
            onPress={onApprovePress}
            variant="primary"
          />
        </>
      )}
    </View>
  );
}

type ActionButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "default" | "primary";
};

function ActionButton({
  title,
  onPress,
  variant = "default",
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[styles.button, isPrimary && styles.primaryButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, isPrimary && styles.primaryButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  button: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: colors.card,
  },

  primaryButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  buttonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.foreground,
  },

  primaryButtonText: {
    color: "#fff",
  },
});

import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, fonts, radius, spacing } from "../../constants/theme";

export type FeedbackVariant = "success" | "warning" | "error" | "info";

export type FeedbackDialogProps = {
  visible: boolean;
  variant?: FeedbackVariant;
  title: string;
  message: string;
  primaryText?: string;
  secondaryText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
};

const variantConfig: Record<
  FeedbackVariant,
  { icon: keyof typeof Ionicons.glyphMap; color: string; background: string }
> = {
  success: {
    icon: "checkmark-circle-outline",
    color: colors.success,
    background: "#F0FDF4",
  },
  warning: {
    icon: "alert-circle-outline",
    color: colors.warning,
    background: "#FFFBEB",
  },
  error: {
    icon: "close-circle-outline",
    color: colors.danger,
    background: "#FEF2F2",
  },
  info: {
    icon: "information-circle-outline",
    color: colors.primary,
    background: "#EEF2FF",
  },
};

export function FeedbackDialog({
  visible,
  variant = "info",
  title,
  message,
  primaryText = "Entendi",
  secondaryText,
  onPrimary,
  onSecondary,
}: FeedbackDialogProps) {
  const config = variantConfig[variant];
  const handleDismiss = secondaryText && onSecondary ? onSecondary : onPrimary;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />

        <View style={styles.dialog}>
          <View style={[styles.iconCircle, { backgroundColor: config.background }]}>
            <Ionicons name={config.icon} size={30} color={config.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {secondaryText && onSecondary ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondary}
                activeOpacity={0.84}
              >
                <Text style={styles.secondaryButtonText}>{secondaryText}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: variant === "error" ? colors.danger : colors.primary },
              ]}
              onPress={onPrimary}
              activeOpacity={0.86}
            >
              <Text style={styles.primaryButtonText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(26, 39, 68, 0.38)",
  },

  dialog: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.foreground,
    textAlign: "center",
  },

  message: {
    marginTop: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
  },

  actions: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  primaryButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: "#fff",
  },

  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  secondaryButtonText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.foreground,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { StatusBadge } from "../ui/StatusBadge";
import { SupportUnit } from "./SupportUnitCard";

type StatusConfigMap = Record<string, { label: string; color: string }>;

type PendingUnitSectionProps = {
  units: SupportUnit[];
  statusConfig: StatusConfigMap;
  onApprove: (unitId: string) => void;
  onReject: (unitId: string) => void;
  onDelete: (unitId: string) => void;
  onUnitPress: (unitId: string) => void;
};

export function PendingUnitSection({
  units,
  statusConfig,
  onApprove,
  onReject,
  onDelete,
  onUnitPress,
}: PendingUnitSectionProps) {
  if (units.length === 0) {
    return null;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Unidades pendentes</Text>
        <Text style={styles.count}>{units.length}</Text>
      </View>

      {units.map((unit) => {
        const config = statusConfig[unit.status] || statusConfig.open;
        const remainingCapacity = Math.max(unit.capacity - unit.current_occupancy, 0);

        return (
          <TouchableOpacity
            key={unit._id}
            style={styles.card}
            onPress={() => onUnitPress(unit._id)}
            activeOpacity={0.85}
          >
            <View style={styles.main}>
              <View style={styles.iconContainer}>
                <Ionicons name="business-outline" size={26} color={colors.warning} />
              </View>

              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {unit.name}
                  </Text>
                  <StatusBadge label={config.label} color={config.color} />
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={15} color={colors.muted} />
                  <Text style={styles.info}>Vagas: {remainingCapacity}/{unit.capacity}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <ActionButton
                icon="checkmark"
                label="Aprovar"
                color={colors.success}
                onPress={() => onApprove(unit._id)}
              />
              <ActionButton
                icon="close"
                label="Rejeitar"
                color={colors.warning}
                onPress={() => onReject(unit._id)}
              />
              <ActionButton
                icon="trash-outline"
                label="Excluir"
                color={colors.danger}
                onPress={() => onDelete(unit._id)}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

type ActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
};

function ActionButton({ icon, label, color, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.actionText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },

  count: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 2,
  },

  main: {
    flexDirection: "row",
    gap: spacing.md,
  },

  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: `${colors.warning}18`,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    gap: spacing.xs,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  name: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  info: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: spacing.sm,
  },

  actionButton: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  actionText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { SupportUnit } from "./SupportUnitCard";
import { StatusBadge } from "../ui/StatusBadge";

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
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>Unidades Pendentes</Text>
        <Text style={styles.emptyText}>
          Nenhuma unidade pendente no momento.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Unidades Pendentes</Text>

      {units.map((unit) => {
        const config = statusConfig[unit.status] || statusConfig.open;
        const remainingCapacity = unit.capacity - unit.current_occupancy;

        return (
          <TouchableOpacity
            key={unit._id}
            style={styles.card}
            onPress={() => onUnitPress(unit._id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="business" size={28} color={colors.muted} />
              </View>

              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {unit.name}
                  </Text>
                  <StatusBadge label={config.label} color={config.color} />
                </View>

                <Text style={styles.info}>
                  👥 Capacidade restante: {remainingCapacity}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => onApprove(unit._id)}
              >
                <Ionicons name="checkmark" size={14} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>
                  Aprovar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => onReject(unit._id)}
              >
                <Ionicons name="close" size={14} color={colors.warning} />
                <Text style={[styles.actionText, { color: colors.warning }]}>
                  Rejeitar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(unit._id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color={colors.danger}
                />
                <Text style={[styles.actionText, { color: colors.danger }]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  emptyContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },

  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },

  cardHeader: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: colors.border,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  name: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.foreground,
    flex: 1,
    marginRight: 8,
  },

  info: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.muted,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },

  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
    borderRadius: radius.sm,
    paddingVertical: 6,
    backgroundColor: `${colors.success}10`,
  },

  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
    borderRadius: radius.sm,
    paddingVertical: 6,
    backgroundColor: `${colors.warning}10`,
  },

  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: `${colors.danger}40`,
    borderRadius: radius.sm,
    paddingVertical: 6,
    backgroundColor: `${colors.danger}10`,
  },

  actionText: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});

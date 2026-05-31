import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Donation } from "../../app/donations/donations";
import { colors, fonts, radius, spacing } from "../../constants/theme";

export const priorityConfig: Record<
  Donation["priority"],
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  low: { label: "Baixa", color: colors.success, icon: "leaf-outline" },
  medium: { label: "Média", color: colors.warning, icon: "alert-circle-outline" },
  high: { label: "Alta", color: "#F97316", icon: "alert-outline" },
  critical: { label: "Crítica", color: colors.danger, icon: "flame-outline" },
};

type Props = {
  donation: Donation;
  isSupportUnit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onApply: () => void;
};

export function DonationCard({
  donation,
  isSupportUnit,
  onEdit,
  onDelete,
}: Props) {
  const config = priorityConfig[donation.priority] ?? priorityConfig.medium;
  const router = useRouter();

  function goToDonationDetail() {
    router.push(`/unit/${donation.support_unit_id}/donation/${donation._id}` as any);
  }

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={isSupportUnit ? undefined : goToDonationDetail}
    >
      <View style={styles.main}>
        <View style={[styles.itemIcon, { backgroundColor: `${config.color}18` }]}>
          <Ionicons name="gift-outline" size={22} color={config.color} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.item} numberOfLines={1}>
              {donation.item_name}
            </Text>

            <View style={[styles.priorityBadge, { backgroundColor: `${config.color}18` }]}>
              <Ionicons name={config.icon} size={12} color={config.color} />
              <Text style={[styles.priorityText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cube-outline" size={15} color={colors.muted} />
            <Text style={styles.infoText}>
              {donation.quantity_needed} unidades necessárias
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {isSupportUnit ? (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onEdit} activeOpacity={0.8}>
              <Ionicons name="pencil-outline" size={16} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, styles.deleteBtn]}
              onPress={onDelete}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={[styles.secondaryBtnText, styles.deleteText]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={goToDonationDetail}
            activeOpacity={0.85}
          >
            <Text style={styles.applyText}>Ver detalhes</Text>
            <Ionicons name="chevron-forward" size={17} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 2,
  },

  main: {
    flexDirection: "row",
    gap: spacing.md,
  },

  itemIcon: {
    width: 48,
    height: 48,
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

  item: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },

  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  priorityText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: spacing.sm,
  },

  ownerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  secondaryBtn: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  secondaryBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },

  deleteBtn: {
    backgroundColor: "#FEF2F2",
  },

  deleteText: {
    color: colors.danger,
  },

  applyBtn: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },

  applyText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: "#fff",
  },
});

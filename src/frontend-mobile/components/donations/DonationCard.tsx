import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../../constants/theme";
import type { Donation } from "../../app/donations/donations";
import { useRouter } from "expo-router";

export const priorityConfig: Record<
  Donation["priority"],
  { label: string; color: string }
> = {
  low: { label: "Baixa", color: colors.success },
  medium: { label: "Média", color: colors.warning },
  high: { label: "Alta", color: "#F97316" },
  critical: { label: "Crítica", color: colors.danger },
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
  onApply,
}: Props) {
  const config = priorityConfig[donation.priority] ?? priorityConfig.medium;
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={[styles.priorityBar, { backgroundColor: config.color }]} />

      <View style={styles.content}>
        {/* Linha superior: nome + prioridade + ações */}
        <View style={styles.top}>
          <Text style={styles.item} numberOfLines={1}>
            {donation.item_name}
          </Text>

          <View style={styles.topRight}>
            <View
              style={[styles.badge, { backgroundColor: config.color + "22" }]}
            >
              <Text style={[styles.badgeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>

            {isSupportUnit && (
              <>
                <TouchableOpacity
                  onPress={onEdit}
                  hitSlop={8}
                  style={styles.iconBtn}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={17}
                    color={colors.muted}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDelete}
                  hitSlop={8}
                  style={styles.iconBtn}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Quantidade */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {donation.quantity_needed} unidades
          </Text>
        </View>

        {/* Botão centralizado na parte inferior */}
        {!isSupportUnit && (
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => router.push(`/unit/${donation.support_unit_id}/donation/${donation._id}`)}
            activeOpacity={0.8}
          >
            <Ionicons name="heart-outline" size={15} color="#fff" />
            <Text style={styles.applyText}>Fazer doação</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    flexDirection: "row",
    overflow: "hidden",
  },
  priorityBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  item: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.foreground,
    flex: 1,
  },
  iconBtn: {
    padding: 4,
  },
  badge: {
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#142B45",
    alignSelf: "flex-end",
  },
  applyText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: "#fff",
  },
});

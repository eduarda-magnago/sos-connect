import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../../constants/theme";
import { useRouter } from "expo-router";

export type Mission = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date: string;
  volunteers_needed: number;
  volunteer_ids: string[];
  support_unit_id: string;
};

export const statusConfig: Record<
  Mission["status"],
  { label: string; color: string }
> = {
  pending: { label: "Pendente", color: colors.warning },
  in_progress: { label: "Em andamento", color: "#3B82F6" },
  completed: { label: "Concluída", color: colors.success },
  cancelled: { label: "Cancelada", color: colors.danger },
};

export const categoryConfig: Record<string, { label: string; icon: string }> = {
  cleaning: { label: "Limpeza", icon: "brush-outline" },
  food: { label: "Alimentação", icon: "fast-food-outline" },
  medical: { label: "Médico", icon: "medkit-outline" },
  transport: { label: "Transporte", icon: "car-outline" },
  other: { label: "Outro", icon: "ellipsis-horizontal-outline" },
};

type Props = {
  mission: Mission;
  isSupportUnit: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function MissionCard({
  mission,
  isSupportUnit,
  onEdit,
  onDelete,
}: Props) {
  const statusCfg = statusConfig[mission.status] ?? statusConfig.pending;
  const categoryCfg =
    categoryConfig[mission.category] ?? categoryConfig.other;
  const router = useRouter();

  const remainingSpots = Math.max(
    mission.volunteers_needed - mission.volunteer_ids.length,
    0
  );

  return (
    <View style={styles.card}>
      <View style={[styles.statusBar, { backgroundColor: statusCfg.color }]} />

      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title} numberOfLines={1}>
            {mission.title}
          </Text>

          <View style={styles.topRight}>
            <View
              style={[styles.badge, { backgroundColor: statusCfg.color + "22" }]}
            >
              <Text style={[styles.badgeText, { color: statusCfg.color }]}>
                {statusCfg.label}
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

        <View style={styles.infoRow}>
          <View style={styles.badge}>
            <Ionicons
              name={categoryCfg.icon as any}
              size={12}
              color={colors.muted}
            />
            <Text style={styles.badgeText}>{categoryCfg.label}</Text>
          </View>

          <View style={styles.badge}>
            <Ionicons name="people-outline" size={12} color={colors.muted} />
            <Text style={styles.badgeText}>
              {remainingSpots} vagas restantes
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.muted} />
          <Text style={styles.dateText}>
            {new Date(mission.date).toLocaleDateString("pt-BR")}
          </Text>
        </View>

        {!isSupportUnit && (
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() =>
              router.push(
                `/unit/${mission.support_unit_id}/mission/${mission._id}`
              )
            }
            activeOpacity={0.8}
          >
            <Ionicons name="hand-left-outline" size={15} color="#fff" />
            <Text style={styles.applyText}>Participar da missão</Text>
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
  statusBar: {
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
  title: {
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
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  infoRow: {
    flexDirection: "row",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    fontFamily: fonts.regular,
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
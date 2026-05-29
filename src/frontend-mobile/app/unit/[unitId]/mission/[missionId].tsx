import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../../services/api";
import { colors, fonts, spacing } from "../../../../constants/theme";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  statusConfig,
  categoryConfig,
} from "../../../../components/missions/MissionCard";

type MissionDetail = {
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

type SupportUnit = {
  _id: string;
  name: string;
  address?: string;
  capacity: number;
  current_occupancy: number;
};

export default function MissionDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const unitId = Array.isArray(params.unitId)
    ? params.unitId[0]
    : params.unitId;

  const missionId = Array.isArray(params.missionId)
    ? params.missionId[0]
    : params.missionId;

  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [unit, setUnit] = useState<SupportUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [missionId]);

  async function loadData() {
    try {
      const [missionRes, unitRes] = await Promise.all([
        api.get(`/missions/${missionId}`),
        api.get(`/support-units/${unitId}`),
      ]);

      setMission(missionRes.data);
      setUnit(unitRes.data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply() {
    try {
      await api.post(`/missions/${missionId}/apply`);
      Alert.alert("✓ Sucesso", "Candidatura enviada com sucesso!");
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a candidatura.");
    }
  }

  if (loading) return <LoadingState />;
  if (!mission || !unit) return <View style={styles.container} />;

  const status = statusConfig[mission.status];
  const category = categoryConfig[mission.category] ?? categoryConfig.other;

  const remainingSpots =
    mission.volunteers_needed - mission.volunteer_ids.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detalhes da Missão</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.missionTitle}>{mission.title}</Text>

          <View style={styles.divider} />

          <Text style={styles.unitName}>{unit.name}</Text>

          {unit.address && (
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={15}
                color={colors.muted}
              />
              <Text style={styles.infoText}>{unit.address}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Informações da missão:
          </Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categoria:</Text>
              <Text style={styles.detailValue}>{category.label}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, { color: status.color }]}>
                {status.label}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data:</Text>
              <Text style={styles.detailValue}>
                {new Date(mission.date).toLocaleDateString("pt-BR")}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vagas restantes:</Text>
              <Text style={styles.detailValue}>
                {remainingSpots}
              </Text>
            </View>

            {mission.description && (
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>
                    <Text style={styles.detailLabel}>Descrição: </Text>
                    {mission.description}
                </Text>
               </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.85}
          >
            <Ionicons name="hand-left-outline" size={18} color="#fff" />
            <Text style={styles.applyText}>
              Candidatar-se para a missão
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
  },
  card: {
    margin: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
  },
  missionTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
  },
  unitName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
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
    flex: 1,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
    marginTop: spacing.xs,
  },
  detailsBox: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    gap: 4,
  },
  detailLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.muted,
  },
  detailValue: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.foreground,
    flex: 1,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: spacing.sm,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#142B45",
  },
  applyText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: "#fff",
  },
  descriptionBox: {
    marginTop: spacing.xs,
    gap: 4,
  },

  descriptionText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 20, 
  },
});
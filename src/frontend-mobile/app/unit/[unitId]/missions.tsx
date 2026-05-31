import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import { colors, fonts, spacing } from "../../../constants/theme";
import { LoadingState } from "../../../components/ui/LoadingState";
import { MissionCard } from "../../../components/missions/MissionCard";
import {
  MissionModal,
  type MissionFormData,
} from "../../../components/missions/MissionModal";

export type Mission = {
  _id: string;
  title: string;
  description?: string;
  category: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date: string;
  support_unit_id: string;
  volunteers_needed: number;
  volunteer_ids: string[];
  contact_phone?: string;
  delivery_time?: string;
};

export default function MissionsPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const unitId = Array.isArray(params.unitId)
    ? params.unitId[0]
    : params.unitId;
  const { user } = useAuth();

  const isSupportUnit = user?.role === "support_unit";

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadMissions();
    }, [unitId])
  );

  async function loadMissions() {
    try {
      const response = await api.get(`/missions?support_unit_id=${unitId}`);
      setMissions(response.data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as missões.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(missionId: string) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta missão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/missions/${missionId}`);
            setMissions((prev) => prev.filter((m) => m._id !== missionId));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir a missão.");
          }
        },
      },
    ]);
  }

  function handleCreate() {
    setEditingMission(null);
    setModalVisible(true);
  }

  function handleEdit(mission: Mission) {
    setEditingMission(mission);
    setModalVisible(true);
  }

  async function handleSubmit(data: MissionFormData) {
    try {
      if (editingMission) {
        const response = await api.put(
          `/missions/${editingMission._id}`,
          data
        );
        setMissions((prev) =>
          prev.map((m) => (m._id === editingMission._id ? response.data : m))
        );
      } else {
        const response = await api.post("/missions", {
          ...data,
          support_unit_id: unitId,
        });
        setMissions((prev) => [...prev, response.data]);
      }
      setModalVisible(false);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a missão.");
    }
  }

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Missões de Ajuda</Text>
        <View style={{ width: 38 }} />
      </View>

      <FlatList
        data={missions}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>Nenhuma missão cadastrada</Text>
            <Text style={styles.emptySubtitle}>
              {isSupportUnit
                ? "Crie missões de ajuda para que voluntários possam participar."
                : "Esta unidade ainda não cadastrou missões de ajuda."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <MissionCard
            mission={item}
            isSupportUnit={isSupportUnit}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
      />

      {isSupportUnit && (
        <TouchableOpacity
          testID="mission-create-fab"
          style={styles.fab}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Nova missão</Text>
        </TouchableOpacity>
      )}

      <MissionModal
        visible={modalVisible}
        mission={editingMission}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
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
  list: {
    padding: spacing.md,
    paddingBottom: 100,
    gap: spacing.sm,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.md,
    left: spacing.md,
    backgroundColor: colors.action,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: spacing.xs,
    shadowColor: colors.action,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: "#fff",
  },
});
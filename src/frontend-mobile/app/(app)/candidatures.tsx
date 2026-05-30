import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { colors, fonts, spacing } from "../../constants/theme";
import { LoadingState } from "../../components/ui/LoadingState";

type SupportUnit = {
  _id: string;
  name: string;
  support_unit_user_id: string;
};

type Application = {
  _id: string;
  status: string;
  mission_id: {
    _id: string;
    title: string;
    description?: string;
    date?: string;
    support_unit_id: string | {
      _id: string;
      name?: string;
    };
  };
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
};

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
  completed: "Concluída",
  withdrawn: "Cancelada",
};

export default function Candidatures() {
  const { user } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [user?._id])
  );

  async function loadApplications() {
    if (!user?._id) return;

    setLoading(true);

    try {
      const [unitsResponse, applicationsResponse] = await Promise.all([
        api.get("/support-units"),
        api.get("/mission-volunteers"),
      ]);

      const myUnits = unitsResponse.data.filter(
        (unit: SupportUnit) => unit.support_unit_user_id === user._id
      );

      const myUnitIds = myUnits.map((unit: SupportUnit) => unit._id);

      const institutionApplications = applicationsResponse.data.filter(
        (application: Application) => {
          const supportUnitId =
            typeof application.mission_id?.support_unit_id === "string"
              ? application.mission_id.support_unit_id
              : application.mission_id?.support_unit_id?._id;

          return myUnitIds.includes(supportUnitId);
        }
      );

      setApplications(institutionApplications);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as candidaturas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(applicationId: string) {
    try {
      setProcessingId(applicationId);

      await api.patch(`/mission-volunteers/${applicationId}`, {
        status: "approved",
      });

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? { ...application, status: "approved" }
            : application
        )
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível confirmar a participação.");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>Nenhuma candidatura encontrada</Text>
            <Text style={styles.emptySubtitle}>
              Quando voluntários se candidatarem às missões das suas unidades,
              elas aparecerão aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isApproved = item.status === "approved";
          const isProcessing = processingId === item._id;

          return (
            <View style={styles.card}>
              <Text style={styles.missionTitle}>{item.mission_id?.title}</Text>

              {!!item.mission_id?.description && (
                <Text style={styles.description}>
                  {item.mission_id.description}
                </Text>
              )}

              {!!item.mission_id?.date && (
                <Text style={styles.info}>
                  Data: {new Date(item.mission_id.date).toLocaleDateString("pt-BR")}
                </Text>
              )}

              <View style={styles.divider} />

              <Text style={styles.info}>
                Candidato: {item.user_id?.name}
              </Text>

              <Text style={styles.info}>
                Email: {item.user_id?.email}
              </Text>

              <Text style={styles.info}>
                Status: {statusLabel[item.status] ?? item.status}
              </Text>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isApproved && styles.confirmButtonDisabled,
                ]}
                disabled={isApproved || isProcessing}
                onPress={() => handleConfirm(item._id)}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmButtonText}>
                  {isProcessing
                    ? "Confirmando..."
                    : isApproved
                      ? "Participação confirmada"
                      : "Confirmar participação"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.xs,
  },
  missionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },
  info: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
  },
  confirmButton: {
    marginTop: spacing.sm,
    backgroundColor: "#142B45",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: colors.muted,
  },
  confirmButtonText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: "#fff",
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
});
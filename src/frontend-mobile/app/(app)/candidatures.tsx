import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LoadingState } from "../../components/ui/LoadingState";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import {
  getLocalApplications,
  type LocalApplication,
} from "../../services/localApplications";

type SupportUnit = {
  _id: string;
  name: string;
  support_unit_user_id: string;
};

type BackendMissionApplication = {
  _id: string;
  status: string;
  mission_id: {
    _id: string;
    title: string;
    description?: string;
    date?: string;
    support_unit_id:
      | string
      | {
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

type CandidatureCard = {
  id: string;
  source: "backend" | "local";
  type: "mission" | "donation";
  title: string;
  unitName?: string;
  applicantName: string;
  applicantEmail: string;
  availableOnSchedule?: boolean;
  status: string;
  date?: string;
};

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
  completed: "Concluída",
  withdrawn: "Cancelada",
};

const typeConfig = {
  mission: {
    label: "Missão",
    icon: "flag-outline" as const,
    color: colors.primary,
  },
  donation: {
    label: "Doação",
    icon: "gift-outline" as const,
    color: colors.action,
  },
};

export default function Candidatures() {
  const { user } = useAuth();

  const [cards, setCards] = useState<CandidatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [user?._id, user?.role])
  );

  async function loadApplications() {
    if (!user?._id) return;

    setLoading(true);

    try {
      const localApplications = await getLocalApplications();

      if (user.role === "volunteer") {
        setCards(
          localApplications
            .filter((application) => application.applicantUserId === user._id)
            .map(localToCard)
        );
        return;
      }

      if (user.role === "support_unit" || user.role === "admin") {
        const [unitsResponse, missionApplicationsResponse] =
          await Promise.all([
            api.get("/support-units"),
            api.get("/mission-volunteers"),
          ]);

        const myUnits = unitsResponse.data.filter(
          (unit: SupportUnit) =>
            user.role === "admin" || unit.support_unit_user_id === user._id
        );
        const myUnitIds = myUnits.map((unit: SupportUnit) => unit._id);

        const missionCards = missionApplicationsResponse.data
          .filter((application: BackendMissionApplication) => {
            const supportUnitId =
              typeof application.mission_id?.support_unit_id === "string"
                ? application.mission_id.support_unit_id
                : application.mission_id?.support_unit_id?._id;

            return myUnitIds.includes(supportUnitId);
          })
          .map((application: BackendMissionApplication) =>
            backendMissionToCard(application)
          );

        const localDonationCards = localApplications
          .filter(
            (application) =>
              application.type === "donation" &&
              myUnitIds.includes(application.unitId)
          )
          .map(localToCard);

        setCards([...localDonationCards, ...missionCards]);
        return;
      }

      setCards([]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as candidaturas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(card: CandidatureCard) {
    if (card.source !== "backend") return;

    try {
      setProcessingId(card.id);

      await api.patch(`/mission-volunteers/${card.id}`, {
        status: "approved",
      });

      setCards((prev) =>
        prev.map((item) =>
          item.id === card.id ? { ...item, status: "approved" } : item
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
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="clipboard-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>Nenhuma candidatura encontrada</Text>
            <Text style={styles.emptySubtitle}>
              As candidaturas para missões e doações aparecerão aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CandidatureItem
            item={item}
            processing={processingId === item.id}
            onConfirm={() => handleConfirm(item)}
          />
        )}
      />
    </View>
  );
}

function localToCard(application: LocalApplication): CandidatureCard {
  return {
    id: application.id,
    source: "local",
    type: application.type,
    title: application.title,
    unitName: application.unitName,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    availableOnSchedule: application.availableOnSchedule,
    status: application.status,
    date: application.createdAt,
  };
}

function backendMissionToCard(
  application: BackendMissionApplication
): CandidatureCard {
  return {
    id: application._id,
    source: "backend",
    type: "mission",
    title: application.mission_id?.title ?? "Missão",
    applicantName: application.user_id?.name ?? "Voluntário",
    applicantEmail: application.user_id?.email ?? "",
    status: application.status,
    date: application.mission_id?.date,
  };
}

function CandidatureItem({
  item,
  processing,
  onConfirm,
}: {
  item: CandidatureCard;
  processing: boolean;
  onConfirm: () => void;
}) {
  const config = typeConfig[item.type];
  const isApproved = item.status === "approved";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: `${config.color}18` }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: `${config.color}18` }]}>
              <Text style={[styles.badgeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
          </View>

          {!!item.unitName && (
            <Text style={styles.mutedText} numberOfLines={1}>
              {item.unitName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.info}>Candidato: {item.applicantName}</Text>
      <Text style={styles.info}>Email: {item.applicantEmail}</Text>
      {item.availableOnSchedule != null && (
        <Text style={styles.info}>
          Disponibilidade no horário: {item.availableOnSchedule ? "Sim" : "Não"}
        </Text>
      )}
      <Text style={styles.info}>
        Status: {statusLabel[item.status] ?? item.status}
      </Text>

      {item.source === "backend" && (
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isApproved && styles.confirmButtonDisabled,
          ]}
          disabled={isApproved || processing}
          onPress={onConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>
            {processing
              ? "Confirmando..."
              : isApproved
                ? "Participação confirmada"
                : "Confirmar participação"}
          </Text>
        </TouchableOpacity>
      )}
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
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    gap: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },
  mutedText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
  },
  info: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.foreground,
  },
  confirmButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
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

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ApplicationModal } from "../../../../components/applications/ApplicationModal";
import { priorityConfig } from "../../../../components/donations/DonationCard";
import { LoadingState } from "../../../../components/ui/LoadingState";
import { useAuth } from "../../../../contexts/AuthContext";
import api from "../../../../services/api";
import { saveLocalApplication } from "../../../../services/localApplications";
import { colors, fonts, spacing } from "../../../../constants/theme";

type DonationDetail = {
  _id: string;
  item_name: string;
  quantity_needed: number;
  quantity_received: number;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "partially_fulfilled" | "fulfilled" | "cancelled";
  support_unit_id: string;
};

type SupportUnit = {
  _id: string;
  name: string;
  address?: string;
  capacity: number;
  current_occupancy: number;
};

type ApplicationFormData = {
  name: string;
  email: string;
  availableOnSchedule: boolean;
};

const statusLabel: Record<DonationDetail["status"], string> = {
  pending: "Pendente",
  partially_fulfilled: "Parcialmente atendido",
  fulfilled: "Atendido",
  cancelled: "Cancelado",
};

export default function DonationDetailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const unitId = Array.isArray(params.unitId) ? params.unitId[0] : params.unitId;
  const donationId = Array.isArray(params.donationId)
    ? params.donationId[0]
    : params.donationId;

  const [donation, setDonation] = useState<DonationDetail | null>(null);
  const [unit, setUnit] = useState<SupportUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationVisible, setApplicationVisible] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);

  useEffect(() => {
    loadData();
  }, [donationId]);

  async function loadData() {
    try {
      const [donationRes, unitRes] = await Promise.all([
        api.get(`/donation-needs/${donationId}`),
        api.get(`/support-units/${unitId}`),
      ]);
      setDonation(donationRes.data);
      setUnit(unitRes.data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(data: ApplicationFormData) {
    if (!donation || !unit || !user) return;

    try {
      setSubmittingApplication(true);

      await saveLocalApplication({
        type: "donation",
        itemId: donation._id,
        title: donation.item_name,
        unitId: unit._id,
        unitName: unit.name,
        applicantUserId: user._id,
        applicantName: data.name,
        applicantEmail: data.email,
        availableOnSchedule: data.availableOnSchedule,
      });

      setApplicationVisible(false);
      Alert.alert("Sucesso", "Candidatura enviada com sucesso!");
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a candidatura.");
    } finally {
      setSubmittingApplication(false);
    }
  }

  if (loading) return <LoadingState />;
  if (!donation || !unit) return <View style={styles.container} />;

  const priority = priorityConfig[donation.priority];
  const capacityRemaining = unit.capacity - unit.current_occupancy;

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
        <Text style={styles.headerTitle}>Detalhes da Doação</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.itemName} testID="donation-item-name">
            {donation.item_name}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.unitName}>{unit.name}</Text>

          {unit.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={15} color={colors.muted} />
              <Text style={styles.infoText}>{unit.address}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={15} color={colors.muted} />
            <Text style={styles.infoText}>
              Capacidade restante: {capacityRemaining}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Informações necessárias para a doação:
          </Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo de doação:</Text>
              <Text style={styles.detailValue}>{donation.item_name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantidade necessária:</Text>
              <Text style={styles.detailValue}>{donation.quantity_needed}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quantidade recebida:</Text>
              <Text style={styles.detailValue}>{donation.quantity_received}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Prioridade:</Text>
              <Text style={[styles.detailValue, { color: priority.color }]}>
                {priority.label}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailValue}>
                {statusLabel[donation.status]}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => setApplicationVisible(true)}
            activeOpacity={0.85}
            testID="donation-apply-btn"
          >
            <Ionicons name="heart-outline" size={18} color="#fff" />
            <Text style={styles.applyText}>Candidatar-se para doação</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <ApplicationModal
        visible={applicationVisible}
        title={donation.item_name}
        defaultName={user?.name}
        defaultEmail={user?.email}
        loading={submittingApplication}
        onClose={() => setApplicationVisible(false)}
        onSubmit={handleApply}
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
  card: {
    margin: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
  },
  itemName: {
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
    fontSize: 14,
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
});

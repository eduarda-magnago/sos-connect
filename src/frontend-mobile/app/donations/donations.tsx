import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { colors, fonts, spacing } from "../../constants/theme";
import { LoadingState } from "../../components/ui/LoadingState";
import { DonationModal } from "../../components/donations/DonationModal";
import { DonationCard } from "../../components/donations/DonationCard";
import {
  confirmFeedback,
  showError,
  showSuccess,
} from "../../components/ui/FeedbackProvider";

export type Donation = {
  _id: string;
  item_name: string;
  quantity_needed: number;
  priority: "low" | "medium" | "high" | "critical";
  support_unit_id: string;
};

export default function DonationsPage() {
  const params = useLocalSearchParams();
  const unitId = Array.isArray(params.unitId)
    ? params.unitId[0]
    : params.unitId;
  const { user } = useAuth();

  const isSupportUnit = user?.role === "support_unit";

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadDonations();
    }, [unitId]),
  );

  async function loadDonations() {
    try {
      const response = await api.get(
        `/donation-needs?support_unit_id=${unitId}`,
      );
      setDonations(response.data);
    } catch {
      showError("Não foi possível carregar", "As necessidades de doação não puderam ser carregadas agora.");
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    setEditingDonation(null);
    setModalVisible(true);
  }

  function handleEdit(donation: Donation) {
    setEditingDonation(donation);
    setModalVisible(true);
  }

  async function handleDelete(donationId: string) {
    confirmFeedback({
      title: "Excluir necessidade?",
      message: "Esta necessidade deixará de aparecer para voluntários.",
      confirmText: "Excluir",
      onConfirm: async () => {
        try {
          await api.delete(`/donation-needs/${donationId}`);
          setDonations((prev) => prev.filter((d) => d._id !== donationId));
        } catch {
          showError("Não foi possível excluir", "Tente novamente em alguns instantes.");
        }
      },
    });
  }

  async function handleApply(donationId: string) {
    try {
      await api.post(`/donation-needs/${donationId}/apply`);
      showSuccess("Candidatura enviada", "A unidade receberá sua intenção de ajudar.");
    } catch {
      showError("Não foi possível enviar", "Tente enviar a candidatura novamente.");
    }
  }

  async function handleSubmit(data: Omit<Donation, "_id" | "support_unit_id">) {
    try {
      if (editingDonation) {
        const response = await api.put(
          `/donation-needs/${editingDonation._id}`,
          data,
        );
        setDonations((prev) =>
          prev.map((d) => (d._id === editingDonation._id ? response.data : d)),
        );
      } else {
        const response = await api.post(
          `/support-units/${unitId}/donation-needs`,
          data,
        );
        setDonations((prev) => [...prev, response.data]);
      }
      setModalVisible(false);
    } catch {
      showError("Não foi possível salvar", "Verifique os dados e tente novamente.");
    }
  }

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="gift-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>
              Nenhuma necessidade cadastrada
            </Text>
            <Text style={styles.emptySubtitle}>
              {isSupportUnit
                ? "Crie necessidades de doação para que voluntários saibam como ajudar."
                : "Esta unidade ainda não cadastrou necessidades de doação."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <DonationCard
            donation={item}
            isSupportUnit={isSupportUnit}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item._id)}
            onApply={() => handleApply(item._id)}
          />
        )}
      />

      {isSupportUnit && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={handleCreate}
            activeOpacity={0.86}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.primaryActionText}>Nova necessidade</Text>
          </TouchableOpacity>
        </View>
      )}

      <DonationModal
        visible={modalVisible}
        donation={editingDonation}
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
  list: {
    padding: spacing.md,
    paddingBottom: 136,
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
  actionBar: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: 64,
  },
  primaryAction: {
    minHeight: 46,
    backgroundColor: colors.action,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: "#fff",
  },
});

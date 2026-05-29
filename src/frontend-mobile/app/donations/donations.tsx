import { useCallback, useState } from "react";
import {
  Alert,
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
      Alert.alert(
        "Erro",
        "Não foi possível carregar as necessidades de doação.",
      );
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
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta necessidade?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/donation-needs/${donationId}`);
            setDonations((prev) => prev.filter((d) => d._id !== donationId));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir a necessidade.");
          }
        },
      },
    ]);
  }

  async function handleApply(donationId: string) {
    try {
      await api.post(`/donation-needs/${donationId}/apply`);
      Alert.alert("✓ Sucesso", "Candidatura enviada com sucesso!");
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a candidatura.");
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
      Alert.alert("Erro", "Não foi possível salvar a necessidade.");
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
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Nova necessidade</Text>
        </TouchableOpacity>
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
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#fff",
  },
});

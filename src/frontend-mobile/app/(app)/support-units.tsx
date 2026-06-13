import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { colors, fonts, spacing } from "../../constants/theme";

import { SearchBar } from "../../components/support-units/SearchBar";
import { SupportUnit } from "../../components/support-units/SupportUnitCard";
import { SupportUnitSection } from "../../components/support-units/SupportUnitSection";
import { PendingUnitSection } from "../../components/support-units/PendingUnitSection";
import { LoadingState } from "../../components/ui/LoadingState";
import { confirmFeedback, showError } from "../../components/ui/FeedbackProvider";

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Disponível", color: colors.success },
  full: { label: "Lotado", color: colors.warning },
  closed: { label: "Fechado", color: colors.danger },
};

export default function SupportUnits() {
  const router = useRouter();
  const { user } = useAuth();

  const [units, setUnits] = useState<SupportUnit[]>([]);
  const [pendingUnits, setPendingUnits] = useState<SupportUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadUnits();
    }, []),
  );

  async function loadUnits() {
    try {
      const response = await api.get("/support-units");
      setUnits(response.data);

      if (user?.role === "admin") {
        const pendingResponse = await api.get("/support-units/pending");
        setPendingUnits(pendingResponse.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(unitId: string) {
    try {
      await api.patch(`/support-units/${unitId}/validate`, { approved: true });
      setPendingUnits((prev) => prev.filter((u) => u._id !== unitId));
      loadUnits();
    } catch {
      showError("Não foi possível aprovar", "Tente novamente em alguns instantes.");
    }
  }

  async function handleReject(unitId: string) {
    confirmFeedback({
      title: "Rejeitar unidade?",
      message: "Esta unidade sairá da lista de validação.",
      confirmText: "Rejeitar",
      onConfirm: async () => {
        try {
          await api.patch(`/support-units/${unitId}/validate`, {
            approved: false,
          });
          setPendingUnits((prev) => prev.filter((u) => u._id !== unitId));
        } catch {
          showError("Não foi possível rejeitar", "Tente novamente em alguns instantes.");
        }
      },
    });
  }

  async function handleDelete(unitId: string) {
    confirmFeedback({
      title: "Excluir unidade?",
      message: "Essa ação remove a unidade da listagem e não pode ser desfeita aqui.",
      confirmText: "Excluir",
      onConfirm: async () => {
        try {
          await api.delete(`/support-units/${unitId}`);
          setPendingUnits((prev) => prev.filter((u) => u._id !== unitId));
          loadUnits();
        } catch {
          showError("Não foi possível excluir", "Tente novamente em alguns instantes.");
        }
      },
    });
  }

  const myUnits = units.filter(
    (unit) => unit.support_unit_user_id === user?._id,
  );

  const otherUnits = units
    .filter((unit) => unit.support_unit_user_id !== user?._id)
    .filter((unit) => unit.name.toLowerCase().includes(search.toLowerCase()));
  const hasVisibleUnits =
    myUnits.length > 0 ||
    otherUnits.length > 0 ||
    (user?.role === "admin" && pendingUnits.length > 0);

  function goToUnitDetail(unitId: string) {
    router.push(`/unit/${unitId}` as any);
  }

  function goToDonations(unitId: string) {
    router.push(`/unit/${unitId}/donations` as any);
  }

  function goToMissions(unitId: string) {
    router.push(`/unit/${unitId}/missions` as any);
  }

  function goToEditUnit(unitId: string) {
    router.push(`/unit/${unitId}/edit` as any);
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />

      <FlatList
        data={[]}
        renderItem={null}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {user?.role === "admin" && (
              <PendingUnitSection
                units={pendingUnits}
                statusConfig={statusConfig}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onUnitPress={goToUnitDetail}
              />
            )}

            <SupportUnitSection
              title="Minhas Unidades de Apoio"
              units={myUnits}
              isOwner
              statusConfig={statusConfig}
              onUnitPress={goToUnitDetail}
              onDonationPress={goToDonations}
              onMissionPress={goToMissions}
              onEditPress={goToEditUnit}
            />

            <SupportUnitSection
              title="Unidades de Apoio"
              units={otherUnits}
              statusConfig={statusConfig}
              onUnitPress={goToUnitDetail}
            />

            {!hasVisibleUnits && (
              <View style={styles.empty}>
                <Ionicons name="business-outline" size={46} color={colors.muted} />
                <Text style={styles.emptyTitle}>Nenhuma unidade encontrada</Text>
                <Text style={styles.emptySubtitle}>
                  Ajuste a busca ou volte mais tarde para ver novas unidades de apoio.
                </Text>
              </View>
            )}
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    paddingBottom: 112,
    paddingTop: spacing.xs,
  },

  empty: {
    alignItems: "center",
    paddingTop: 72,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
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
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
  },
});

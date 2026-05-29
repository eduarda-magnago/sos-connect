import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { colors } from "../../constants/theme";

import { SearchBar } from "../../components/support-units/SearchBar";
import { SupportUnit } from "../../components/support-units/SupportUnitCard";
import { SupportUnitSection } from "../../components/support-units/SupportUnitSection";
import { LoadingState } from "../../components/ui/LoadingState";

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Disponível", color: colors.success },
  full: { label: "Lotado", color: colors.warning },
  closed: { label: "Fechado", color: colors.danger },
};

export default function SupportUnits() {
  const router = useRouter();
  const { user } = useAuth();

  const [units, setUnits] = useState<SupportUnit[]>([]);
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const myUnits = units.filter(
    (unit) => unit.support_unit_user_id === user?._id,
  );

  const otherUnits = units
    .filter((unit) => unit.support_unit_user_id !== user?._id)
    .filter((unit) => unit.name.toLowerCase().includes(search.toLowerCase()));

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
        ListHeaderComponent={
          <>
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

            <View style={styles.bottomSpace} />
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

  bottomSpace: {
    height: 24,
  },
});

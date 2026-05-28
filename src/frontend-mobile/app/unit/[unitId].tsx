import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/theme';

import { LoadingState } from '../../components/ui/LoadingState';
import { UnitHeader } from '../../components/unit-detail/UnitHeader';
import { UnitInfo } from '../../components/unit-detail/UnitInfo';
import { UnitRoleActions } from '../../components/unit-detail/UnitRoleActions';

type SupportUnit = {
  _id: string;
  name: string;
  status: string;
  capacity: number;
  current_occupancy: number;
  description?: string;
  services_available: string[];
  support_unit_user_id: string;
  image_url?: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Disponível', color: colors.success },
  full: { label: 'Lotado', color: colors.warning },
  closed: { label: 'Fechado', color: colors.danger },
};

export default function UnitDetailModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const unitId = Array.isArray(params.unitId)
    ? params.unitId[0]
    : params.unitId;

  const [unit, setUnit] = useState<SupportUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnit();
  }, [unitId]);

  async function loadUnit() {
    try {
      const response = await api.get(`/support-units/${unitId}`);
      setUnit(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da unidade.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!unit) {
    return <View style={styles.container} />;
  }

  const config = statusConfig[unit.status] || statusConfig.open;
  const isOwner = unit.support_unit_user_id === user?._id;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <UnitHeader
        name={unit.name}
        imageUrl={unit.image_url}
        statusLabel={config.label}
        statusColor={config.color}
      />

      <UnitInfo
        capacity={unit.capacity}
        currentOccupancy={unit.current_occupancy}
        services={unit.services_available}
        description={unit.description}
      />

      <UnitRoleActions
        role={user?.role}
        isOwner={isOwner}
        onRoutePress={() => Alert.alert('Rota', 'Funcionalidade futura.')}
        onAskHelpPress={() => Alert.alert('Ajuda', 'Funcionalidade futura.')}
        onVolunteerPress={() => Alert.alert('Missão', 'Funcionalidade futura.')}
        onEditPress={() => router.push(`/unit/${unit._id}/edit` as any)}
        onDonationsPress={() => router.push(`/unit/${unit._id}/donations` as any)}
        onMissionsPress={() => router.push(`/unit/${unit._id}/missions` as any)}
        onApprovePress={() => Alert.alert('Admin', 'Funcionalidade futura.')}
      />

      <View style={styles.bottomSpace} />
    </ScrollView>
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
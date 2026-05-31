import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { colors, radius } from '../../constants/theme';

import { LoadingState } from '../../components/ui/LoadingState';
import { UnitHeader } from '../../components/unit-detail/UnitHeader';
import { UnitInfo } from '../../components/unit-detail/UnitInfo';
import { UnitRoleActions } from '../../components/unit-detail/UnitRoleActions';
import { MapModal } from '../../components/unit-detail/MapModal';

type UserRole = 'victim' | 'volunteer' | 'support_unit' | 'admin';

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
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
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
  const [mapVisible, setMapVisible] = useState(false);

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

  function handleRoutePress() {
    if (!unit?.location?.coordinates) {
      Alert.alert('Rota', 'Localização não disponível.');
      return;
    }
    setMapVisible(true);
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!unit) {
    return <View style={styles.container} />;
  }

  const config = statusConfig[unit.status] || statusConfig.open;
  const isOwner = unit.support_unit_user_id === user?._id;

  const longitude = unit.location?.coordinates[0];
  const latitude = unit.location?.coordinates[1];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentPanel}>
        <UnitHeader
          name={unit.name}
          imageUrl={unit.image_url}
          statusLabel={config.label}
          statusColor={config.color}
        />

        <View style={styles.divider} />

        <UnitInfo
          capacity={unit.capacity}
          currentOccupancy={unit.current_occupancy}
          services={unit.services_available}
          description={unit.description}
        />

        <View style={styles.divider} />

        <UnitRoleActions
          role={user?.role as UserRole | undefined}
          isOwner={isOwner}
          onRoutePress={handleRoutePress}
          onAskHelpPress={() => Alert.alert('Ajuda', 'Funcionalidade futura.')}
          onVolunteerPress={() => router.push(`/unit/${unit._id}/missions` as any)}
          onEditPress={() => router.push(`/unit/${unit._id}/edit` as any)}
          onDonationsPress={() => router.push(`/unit/${unit._id}/donations` as any)}
          onMissionsPress={() => router.push(`/unit/${unit._id}/missions` as any)}
          onApprovePress={() => Alert.alert('Admin', 'Funcionalidade futura.')}
        />
      </View>

      <View style={styles.bottomSpace} />

      {latitude && longitude && (
        <MapModal
          visible={mapVisible}
          onClose={() => setMapVisible(false)}
          latitude={latitude}
          longitude={longitude}
          title={unit.name}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentPanel: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    elevation: 2,
    overflow: 'hidden',
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  bottomSpace: {
    height: 24,
  },
});

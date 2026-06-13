import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { colors, radius } from '../../constants/theme';

import { LoadingState } from '../../components/ui/LoadingState';
import { UnitHeader } from '../../components/unit-detail/UnitHeader';
import { UnitInfo } from '../../components/unit-detail/UnitInfo';
import { UnitRoleActions } from '../../components/unit-detail/UnitRoleActions';

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

  async function handleRoutePress() {
    if (!unit?.location?.coordinates) {
      Alert.alert('Rota', 'Localização não disponível.');
      return;
    }
    const longitude = Number(unit.location.coordinates[0]);
    const latitude = Number(unit.location.coordinates[1]);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert('Rota', 'Localizacao nao disponivel.');
      return;
    }

    const label = encodeURIComponent(unit.name);
    const destination = `${latitude},${longitude}`;
    const mapsUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${destination}&q=${label}`
        : `geo:0,0?q=${destination}(${label})`;
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    try {
      const supported = await Linking.canOpenURL(mapsUrl);
      await Linking.openURL(supported ? mapsUrl : fallbackUrl);
    } catch (error) {
      console.error(error);
      try {
        await Linking.openURL(fallbackUrl);
      } catch {
        Alert.alert('Rota', 'Nao foi possivel abrir o app de mapas.');
      }
    }
  }

  function handleDeletePress() {
    if (!unit) {
      return;
    }

    Alert.alert('Apagar unidade', 'Tem certeza que deseja apagar esta unidade de apoio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/support-units/${unit._id}`);
            Alert.alert('Sucesso', 'Unidade apagada com sucesso.', [
              {
                text: 'OK',
                onPress: () => router.replace('/(app)/support-units' as any),
              },
            ]);
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Nao foi possivel apagar a unidade.');
          }
        },
      },
    ]);
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
          onDeletePress={handleDeletePress}
          onDonationsPress={() => router.push(`/unit/${unit._id}/donations` as any)}
          onMissionsPress={() => router.push(`/unit/${unit._id}/missions` as any)}
          onApprovePress={() => Alert.alert('Admin', 'Funcionalidade futura.')}
        />
      </View>

      <View style={styles.bottomSpace} />

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

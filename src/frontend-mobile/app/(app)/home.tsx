import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';

import api from '../../services/api';
import { colors } from '../../constants/theme';

import { MapCard } from '../../components/home/MapCard';
import { NearbyUnitCard } from '../../components/home/NearbyUnitCard';
import { SectionHeader } from '../../components/ui/SectionHeader';

type SupportUnit = {
  _id: string;
  name: string;
  status: string;
  capacity: number;
  current_occupancy: number;
  location: {
    coordinates: number[];
  };
  services_available: string[];
};

type LocationCoords = {
  latitude: number;
  longitude: number;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Disponível', color: colors.success },
  full: { label: 'Lotado', color: colors.warning },
  closed: { label: 'Fechado', color: colors.danger },
};

export default function Home() {
  const [units, setUnits] = useState<SupportUnit[]>([]);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getLocation();
    loadUnits();
  }, []);

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  async function loadUnits(status?: string) {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/support-units${params}`);

      setUnits(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(status: string) {
    const newStatus = statusFilter === status ? '' : status;

    setStatusFilter(newStatus);
    loadUnits(newStatus);
  }

  function handleClearFilter() {
    setStatusFilter('');
    loadUnits();
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionHeader title="Encontre ajuda perto de você!" />

      <MapCard
        units={units}
        loading={loading}
        userLocation={userLocation}
        statusConfig={statusConfig}
      />

      <SectionHeader
        title="Unidades próximas"
        rightText={`${units.length} encontradas`}
      />

      {units.slice(0, 3).map((unit) => {
        const config = statusConfig[unit.status] || statusConfig.open;

        return (
          <NearbyUnitCard
            key={unit._id}
            unit={unit}
            statusConfig={config}
          />
        );
      })}

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
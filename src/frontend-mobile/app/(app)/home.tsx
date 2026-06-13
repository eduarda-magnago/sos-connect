import { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';

import api from '../../services/api';
import { colors } from '../../constants/theme';

import { MapCard } from '../../components/home/MapCard';
import { NearbyUnitCard } from '../../components/home/NearbyUnitCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import {
  MapFilters,
  EMPTY_FILTERS,
  countActiveFilters,
  type MapFilterValues,
} from '../../components/home/MapFilters';

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
  image_url?: string;
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
  const router = useRouter();

  const [units, setUnits] = useState<SupportUnit[]>([]);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MapFilterValues>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);

  const activeCount = countActiveFilters(filters);

  useFocusEffect(
    useCallback(() => {
      init();
    }, [filters]),
  );

  async function init() {
    const coords = await getLocation();
    await loadUnits(filters, coords);
  }

  async function getLocation(): Promise<LocationCoords | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(coords);

      return coords;
    } catch (error) {
      console.warn('Nao foi possivel obter a localizacao atual.', error);
      return null;
    }
  }

  async function loadUnits(
    applied: MapFilterValues,
    coords?: LocationCoords | null,
  ) {
    try {
      setLoading(true);

      const loc = coords ?? userLocation;
      const parts: string[] = [];

      if (applied.status) {
        parts.push(`status=${applied.status}`);
      }

      if (applied.services.length > 0) {
        parts.push(`services=${encodeURIComponent(applied.services.join(','))}`);
      }

      if (applied.minAvailableCapacity != null) {
        parts.push(`minAvailableCapacity=${applied.minAvailableCapacity}`);
      }

      if (applied.radius != null && loc) {
        parts.push(`lat=${loc.latitude}`);
        parts.push(`lng=${loc.longitude}`);
        parts.push(`radius=${applied.radius}`);
      }

      const query = parts.length > 0 ? `?${parts.join('&')}` : '';
      const response = await api.get(`/support-units${query}`);

      setUnits(response.data);

      if (countActiveFilters(applied) === 0) {
        const set = new Set<string>();
        response.data.forEach((u: SupportUnit) =>
          (u.services_available || []).forEach((s) => set.add(s)),
        );
        setServiceOptions(Array.from(set).sort());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleApplyFilters(values: MapFilterValues) {
    setFilters(values);
    setFiltersOpen(false);
    loadUnits(values);
  }

  function goToUnitDetail(unitId: string) {
    router.push(`/unit/${unitId}` as any);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <MapCard
        units={units}
        loading={loading}
        userLocation={userLocation}
        statusConfig={statusConfig}
        activeFiltersCount={activeCount}
        onFilterPress={() => setFiltersOpen(true)}
      />

      <SectionHeader title="Unidades próximas" />

      {units.slice(0, 3).map((unit) => {
        const config = statusConfig[unit.status] || statusConfig.open;

        return (
          <NearbyUnitCard
            key={unit._id}
            unit={unit}
            statusConfig={config}
            onPress={() => goToUnitDetail(unit._id)}
          />
        );
      })}

      <MapFilters
        visible={filtersOpen}
        initial={filters}
        serviceOptions={serviceOptions}
        hasLocation={!!userLocation}
        onClose={() => setFiltersOpen(false)}
        onApply={handleApplyFilters}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 124,
  },
});

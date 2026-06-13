import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

import api from '../../services/api';
import { colors, fonts, spacing } from '../../constants/theme';

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

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const coords = await getLocation();
    await loadUnits(EMPTY_FILTERS, coords);
  }

  async function getLocation(): Promise<LocationCoords | null> {
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
  }

  async function loadUnits(
    applied: MapFilterValues,
    coords?: LocationCoords | null
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
          (u.services_available || []).forEach((s) => set.add(s))
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

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    loadUnits(EMPTY_FILTERS);
  }

  function goToUnitDetail(unitId: string) {
    router.push(`/unit/${unitId}` as any);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.filterBar}>
        <TouchableOpacity
          testID="dashboard-filter-button"
          style={styles.filterBtn}
          onPress={() => setFiltersOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color={colors.foreground} />
          <Text style={styles.filterBtnText}>Filtros</Text>
          {activeCount > 0 && (
            <View testID="dashboard-filter-badge" style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {activeCount > 0 && (
          <TouchableOpacity testID="dashboard-filter-clear" onPress={handleClearFilters} hitSlop={8}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

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
            onPress={() => goToUnitDetail(unit._id)}
          />
        );
      })}

      <View style={styles.bottomSpace} />

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

  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  filterBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.foreground,
  },

  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#fff',
  },

  clearText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.action,
  },

  bottomSpace: {
    height: 24,
  },
});

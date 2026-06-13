import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { colors, fonts, radius, spacing } from '../../constants/theme';

type SupportUnit = {
  _id: string;
  name: string;
  status: string;
  capacity: number;
  current_occupancy: number;
  image_url?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  location: {
    coordinates: number[];
  };
};

type LocationCoords = {
  latitude: number;
  longitude: number;
};

type StatusConfig = Record<string, { label: string; color: string }>;

type MapCardProps = {
  units: SupportUnit[];
  loading: boolean;
  userLocation: LocationCoords | null;
  statusConfig: StatusConfig;
  activeFiltersCount?: number;
  onFilterPress?: () => void;
};

function getUnitCoordinate(unit: SupportUnit) {
  const [lng, lat] = unit.location?.coordinates || [];
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

export function MapCard({
  units,
  loading,
  userLocation,
  statusConfig,
  activeFiltersCount = 0,
  onFilterPress,
}: MapCardProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const unitsWithLocation = units
    .map((unit) => ({
      unit,
      coordinate: getUnitCoordinate(unit),
    }))
    .filter((item): item is { unit: SupportUnit; coordinate: LocationCoords } =>
      item.coordinate !== null
    );

  const selectedUnit = unitsWithLocation.find(
    ({ unit }) => unit._id === selectedUnitId,
  )?.unit;
  const selectedConfig = selectedUnit
    ? statusConfig[selectedUnit.status] || statusConfig.open
    : null;
  const selectedAvailable = selectedUnit
    ? Math.max(selectedUnit.capacity - selectedUnit.current_occupancy, 0)
    : 0;

  const defaultRegion = {
    latitude: userLocation?.latitude || -3.7172,
    longitude: userLocation?.longitude || -38.5433,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="map-outline" size={16} color={colors.primary} />
          <Text style={styles.title}>Mapa de unidades</Text>
        </View>

        {onFilterPress ? (
          <TouchableOpacity
            testID="dashboard-filter-button"
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive,
            ]}
            onPress={onFilterPress}
            activeOpacity={0.82}
          >
            <Ionicons
              name="options-outline"
              size={17}
              color={activeFiltersCount > 0 ? colors.action : colors.primary}
            />
            {activeFiltersCount > 0 ? (
              <View testID="dashboard-filter-badge" style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator color={colors.action} />
        </View>
      ) : (
        <View style={styles.mapArea}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={defaultRegion}
            showsUserLocation
            showsMyLocationButton
            onPress={() => setSelectedUnitId(null)}
          >
            {userLocation ? (
              <Circle
                center={userLocation}
                radius={10000}
                strokeColor={colors.primary}
                strokeWidth={1}
                fillColor="rgba(26,39,68,0.05)"
              />
            ) : null}

            {unitsWithLocation.map(({ unit, coordinate }) => {
              const config = statusConfig[unit.status] || statusConfig.open;

              return (
                <Marker
                  key={unit._id}
                  coordinate={coordinate}
                  pinColor={config.color}
                  onPress={() => setSelectedUnitId(unit._id)}
                />
              );
            })}
          </MapView>

          {selectedUnit && selectedConfig ? (
            <View style={styles.previewCard}>
              {selectedUnit.image_url ? (
                <Image source={{ uri: selectedUnit.image_url }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewImagePlaceholder}>
                  <Text style={styles.previewImageText}>SOS</Text>
                </View>
              )}

              <View style={styles.previewContent}>
                <Text style={styles.previewTitle} numberOfLines={1}>
                  {selectedUnit.name}
                </Text>

                <View style={styles.statusRow}>
                  <View
                    style={[styles.statusDot, { backgroundColor: selectedConfig.color }]}
                  />
                  <Text style={styles.statusText}>{selectedConfig.label}</Text>
                </View>

                <View style={styles.previewMetaRow}>
                  <Ionicons name="people-outline" size={13} color={colors.muted} />
                  <Text style={styles.previewText}>
                    {selectedAvailable}/{selectedUnit.capacity} vagas livres
                  </Text>
                </View>

                {selectedUnit.contact?.phone ? (
                  <View style={styles.previewMetaRow}>
                    <Ionicons name="call-outline" size={13} color={colors.primary} />
                    <Text style={styles.previewContact} numberOfLines={1}>
                      {selectedUnit.contact.phone}
                    </Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedUnitId(null)}
                hitSlop={8}
              >
                <Ionicons name="close" size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.foreground,
  },

  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterButtonActive: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },

  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  filterBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#fff',
  },

  mapArea: {
    position: 'relative',
  },

  map: {
    height: 238,
    width: '100%',
  },

  placeholder: {
    height: 238,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },

  previewCard: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  previewImage: {
    width: 62,
    height: 62,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },

  previewImagePlaceholder: {
    width: 62,
    height: 62,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewImageText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.muted,
  },

  previewContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },

  previewTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.foreground,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 3,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.foreground,
  },

  previewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },

  previewText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },

  previewContact: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },

  closeButton: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
        <Text style={styles.title}>Mapa de Unidades de Apoio</Text>
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

                <Text style={styles.previewText}>
                  Vagas livres: {selectedAvailable}/{selectedUnit.capacity}
                </Text>
                <Text style={styles.previewText}>
                  Ocupacao atual: {selectedUnit.current_occupancy}
                </Text>

                {selectedUnit.contact?.phone ? (
                  <Text style={styles.previewContact} numberOfLines={1}>
                    Tel: {selectedUnit.contact.phone}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedUnitId(null)}
                hitSlop={8}
              >
                <Text style={styles.closeText}>x</Text>
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
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: 'hidden',
    elevation: 2,
  },

  header: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.foreground,
  },

  mapArea: {
    position: 'relative',
  },

  map: {
    height: 240,
    width: '100%',
  },

  placeholder: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },

  previewCard: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
  },

  previewImage: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },

  previewImagePlaceholder: {
    width: 64,
    height: 64,
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

  previewText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },

  previewContact: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    marginTop: 4,
  },

  closeButton: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.muted,
  },
});

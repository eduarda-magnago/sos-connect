import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type SupportUnit = {
  _id: string;
  name: string;
  status: string;
  capacity: number;
  current_occupancy: number;
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

export function MapCard({
  units,
  loading,
  userLocation,
  statusConfig,
}: MapCardProps) {
  const defaultRegion = {
    latitude: userLocation?.latitude || -3.7172,
    longitude: userLocation?.longitude || -38.5433,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mapa de Unidades de Apoio</Text>

      {loading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator color={colors.action} />
        </View>
      ) : (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={defaultRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {userLocation ? (
            <Circle
              center={userLocation}
              radius={10000}
              strokeColor={colors.primary}
              fillColor="rgba(26,39,68,0.05)"
            />
          ) : null}

          {units.map((unit) => {
            const [lng, lat] = unit.location?.coordinates || [0, 0];
            const config = statusConfig[unit.status] || statusConfig.open;

            return (
              <Marker
                key={unit._id}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                title={unit.name}
                description={`${config.label} • Vagas: ${
                  unit.capacity - unit.current_occupancy
                }`}
                pinColor={config.color}
              />
            );
          })}
        </MapView>
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

  title: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.foreground,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },

  map: {
    height: 240,
    width: '100%',
  },

  placeholder: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});
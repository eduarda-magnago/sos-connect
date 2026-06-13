import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import { StatusBadge } from '../ui/StatusBadge';

type SupportUnit = {
  _id: string;
  name: string;
  status: string;
  capacity: number;
  current_occupancy: number;
  services_available: string[];
  image_url?: string;
};

type StatusConfig = {
  label: string;
  color: string;
};

type NearbyUnitCardProps = {
  unit: SupportUnit;
  statusConfig: StatusConfig;
  onPress?: () => void;
};

export function NearbyUnitCard({ unit, statusConfig, onPress }: NearbyUnitCardProps) {
  const remainingCapacity = Math.max(unit.capacity - unit.current_occupancy, 0);
  const services = unit.services_available?.slice(0, 3).join(', ');

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.84}
    >
      <View style={styles.imageBox}>
        {unit.image_url ? (
          <Image source={{ uri: unit.image_url }} style={styles.image} />
        ) : (
          <Ionicons name="business-outline" size={30} color={colors.muted} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {unit.name}
          </Text>

          <StatusBadge
            label={statusConfig.label}
            color={statusConfig.color}
          />
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={14} color={colors.muted} />
          <Text style={styles.info}>
            {remainingCapacity}/{unit.capacity} vagas livres
          </Text>
        </View>

        {services ? (
          <View style={styles.metaRow}>
            <Ionicons name="medical-outline" size={14} color={colors.muted} />
            <Text style={styles.info} numberOfLines={1}>
              {services}
            </Text>
          </View>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    elevation: 1,
  },

  imageBox: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  content: {
    flex: 1,
    minWidth: 0,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  name: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.foreground,
    flex: 1,
    marginRight: 8,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },

  info: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
});

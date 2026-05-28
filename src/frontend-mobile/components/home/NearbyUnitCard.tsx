import { View, Text, StyleSheet } from 'react-native';
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
};

type StatusConfig = {
  label: string;
  color: string;
};

type NearbyUnitCardProps = {
  unit: SupportUnit;
  statusConfig: StatusConfig;
};

export function NearbyUnitCard({ unit, statusConfig }: NearbyUnitCardProps) {
  const remainingCapacity = unit.capacity - unit.current_occupancy;

  return (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Ionicons name="business" size={32} color={colors.muted} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {unit.name}
          </Text>

          <StatusBadge
            label={statusConfig.label}
            color={statusConfig.color}
          />
        </View>

        <Text style={styles.info}>
          👥 Vagas: {remainingCapacity}/{unit.capacity}
        </Text>

        {unit.services_available?.length > 0 ? (
          <Text style={styles.info} numberOfLines={1}>
            🛠️ {unit.services_available.join(', ')}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    elevation: 2,
  },

  imageBox: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  name: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.foreground,
    flex: 1,
    marginRight: 8,
  },

  info: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
});
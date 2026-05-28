import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import { StatusBadge } from '../ui/StatusBadge';

export type SupportUnit = {
  _id: string;
  name: string;
  status: string;
  capacity: number;
  current_occupancy: number;
  location: {
    coordinates: number[];
  };
  services_available: string[];
  support_unit_user_id: string;
  image_url?: string;
};

type StatusConfig = {
  label: string;
  color: string;
};

type SupportUnitCardProps = {
  unit: SupportUnit;
  isOwner?: boolean;
  statusConfig: StatusConfig;
  onPress: () => void;
  onDonationPress?: () => void;
  onMissionPress?: () => void;
  onEditPress?: () => void;
};

export function SupportUnitCard({
  unit,
  isOwner = false,
  statusConfig,
  onPress,
  onDonationPress,
  onMissionPress,
  onEditPress,
}: SupportUnitCardProps) {
  const remainingCapacity = unit.capacity - unit.current_occupancy;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {unit.image_url ? (
          <Image source={{ uri: unit.image_url }} style={styles.image} />
        ) : (
          <Ionicons name="business" size={36} color={colors.muted} />
        )}
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
          👥 Capacidade restante: {remainingCapacity}
        </Text>

        {unit.services_available?.length > 0 ? (
          <Text style={styles.info} numberOfLines={1}>
            🛠️ {unit.services_available.join(', ')}
          </Text>
        ) : null}

        <View style={styles.actions}>
          {isOwner ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={onDonationPress}>
                <Text style={styles.actionButtonText}>Doação</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={onMissionPress}>
                <Text style={styles.actionButtonText}>Missão</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
                <Ionicons name="pencil" size={16} color={colors.muted} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.viewButton} onPress={onPress}>
              <Text style={styles.viewButtonText}>Visualizar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    elevation: 2,
  },

  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  content: {
    padding: spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  name: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
    flex: 1,
    marginRight: 8,
  },

  info: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 2,
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
    alignItems: 'center',
  },

  actionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  actionButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.foreground,
  },

  editButton: {
    marginLeft: 'auto',
  },

  viewButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },

  viewButtonText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.foreground,
  },
});
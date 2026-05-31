import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const remainingCapacity = Math.max(unit.capacity - unit.current_occupancy, 0);
  const servicePreview = unit.services_available?.slice(0, 2).join(', ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.main}>
        <View style={styles.imageContainer}>
          {unit.image_url ? (
            <Image source={{ uri: unit.image_url }} style={styles.image} />
          ) : (
            <Ionicons name="business-outline" size={28} color={colors.muted} />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {unit.name}
            </Text>
            <StatusBadge label={statusConfig.label} color={statusConfig.color} />
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={15} color={colors.muted} />
            <Text style={styles.info}>Vagas: {remainingCapacity}/{unit.capacity}</Text>
          </View>

          {!!servicePreview && (
            <View style={styles.infoRow}>
              <Ionicons name="medkit-outline" size={15} color={colors.muted} />
              <Text style={styles.info} numberOfLines={1}>
                {servicePreview}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        {isOwner ? (
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onDonationPress} activeOpacity={0.8}>
              <Ionicons name="gift-outline" size={16} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>Doações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID={`support-unit-mission-${unit._id}`}
              style={styles.secondaryBtn}
              onPress={onMissionPress}
              activeOpacity={0.8}
            >
              <Ionicons name="flag-outline" size={16} color={colors.primary} />
              <Text style={styles.secondaryBtnText}>Missões</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={onEditPress} activeOpacity={0.8}>
              <Ionicons name="pencil-outline" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.viewAction}>
            <Text style={styles.viewText}>Ver detalhes</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.primary} />
          </View>
        )}
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
    padding: spacing.md,
    gap: spacing.md,
    elevation: 2,
  },

  main: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background,
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
    gap: spacing.xs,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  name: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  info: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: spacing.sm,
  },

  ownerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  secondaryBtn: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  secondaryBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.primary,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewAction: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },

  viewText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
  },
});

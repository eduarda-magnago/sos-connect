import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../../constants/theme';
import { SupportUnit, SupportUnitCard } from './SupportUnitCard';

type StatusConfigMap = Record<string, { label: string; color: string }>;

type SupportUnitSectionProps = {
  title: string;
  units: SupportUnit[];
  statusConfig: StatusConfigMap;
  isOwner?: boolean;
  onUnitPress: (unitId: string) => void;
  onDonationPress?: (unitId: string) => void;
  onMissionPress?: (unitId: string) => void;
  onEditPress?: (unitId: string) => void;
};

export function SupportUnitSection({
  title,
  units,
  statusConfig,
  isOwner = false,
  onUnitPress,
  onDonationPress,
  onMissionPress,
  onEditPress,
}: SupportUnitSectionProps) {
  if (units.length === 0) {
    return null;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>
          {units.length} {units.length === 1 ? 'unidade' : 'unidades'}
        </Text>
      </View>

      {units.map((unit) => {
        const config = statusConfig[unit.status] || statusConfig.open;

        return (
          <SupportUnitCard
            key={unit._id}
            unit={unit}
            isOwner={isOwner}
            statusConfig={config}
            onPress={() => onUnitPress(unit._id)}
            onDonationPress={() => onDonationPress?.(unit._id)}
            onMissionPress={() => onMissionPress?.(unit._id)}
            onEditPress={() => onEditPress?.(unit._id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },

  header: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  count: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
});

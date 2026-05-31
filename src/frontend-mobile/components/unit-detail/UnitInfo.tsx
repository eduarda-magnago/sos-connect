import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type UnitInfoProps = {
  capacity: number;
  currentOccupancy: number;
  services: string[];
  description?: string;
};

type MetricProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  testID?: string;
};

export function UnitInfo({
  capacity,
  currentOccupancy,
  services,
  description,
}: UnitInfoProps) {
  const remainingCapacity = Math.max(capacity - currentOccupancy, 0);
  const occupancyPercent =
    capacity > 0 ? Math.min(100, Math.round((currentOccupancy / capacity) * 100)) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.metrics}>
        <Metric icon="people-outline" label="Vagas" value={`${remainingCapacity}/${capacity}`} testID="unit-capacity" />
        <Metric icon="stats-chart-outline" label="Ocupação" value={`${occupancyPercent}%`} testID="unit-occupancy"/>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="medkit-outline" size={17} color={colors.primary} />
          <Text style={styles.sectionTitle} testID="unit-services-title">Serviços disponíveis</Text>
        </View>

        {services?.length > 0 ? (
          <View style={styles.chipRow}>
            {services.map((service) => (
              <View key={service} style={styles.chip}>
                <Text style={styles.chipText}>{service}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Serviços não informados</Text>
        )}
      </View>

      {description ? (
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="document-text-outline" size={17} color={colors.primary} />
            <Text style={styles.sectionTitle}>Descrição</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Metric({ icon, label, value, testID }: MetricProps) {
  return (
    <View style={styles.metric} testID={testID}>
      <View style={styles.metricIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    gap: spacing.md,
  },

  metrics: {
    gap: spacing.sm,
  },

  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },

  metricValue: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
  },

  metricLabel: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.foreground,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },

  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },

  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.foreground,
  },

  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },

  description: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
  },
});

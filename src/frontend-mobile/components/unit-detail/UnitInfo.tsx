import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type UnitInfoProps = {
  capacity: number;
  currentOccupancy: number;
  services: string[];
  description?: string;
};

export function UnitInfo({
  capacity,
  currentOccupancy,
  services,
  description,
}: UnitInfoProps) {
  const remainingCapacity = capacity - currentOccupancy;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Informações</Text>

      <Text style={styles.info}>
        👥 Capacidade restante: {remainingCapacity}/{capacity}
      </Text>

      {services?.length > 0 ? (
        <Text style={styles.info}>
          🛠️ Serviços: {services.join(', ')}
        </Text>
      ) : (
        <Text style={styles.info}>🛠️ Serviços não informados</Text>
      )}

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    elevation: 2,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },

  info: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
  },

  description: {
    marginTop: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.foreground,
  },
});
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import { FilterChip } from '../ui/FilterChip';

type FilterCardProps = {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onClear: () => void;
};

const filters = [
  { value: 'open', label: 'Disponível' },
  { value: 'full', label: 'Lotado' },
  { value: 'closed', label: 'Fechado' },
];

export function FilterCard({
  selectedStatus,
  onSelectStatus,
  onClear,
}: FilterCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Filtros</Text>

        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearButton}>Limpar filtro</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Status da unidade</Text>

      <View style={styles.row}>
        {filters.map((filter) => (
          <FilterChip
            key={filter.value}
            label={filter.label}
            active={selectedStatus === filter.value}
            onPress={() => onSelectStatus(filter.value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    marginTop: 0,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.md,
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  title: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.foreground,
  },

  clearButton: {
    fontSize: 12,
    color: colors.action,
    fontFamily: fonts.medium,
  },

  label: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: fonts.regular,
    marginBottom: spacing.sm,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
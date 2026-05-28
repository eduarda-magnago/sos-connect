import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type StatusSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const statuses = [
  { value: 'open', label: 'Disponível' },
  { value: 'full', label: 'Lotado' },
  { value: 'closed', label: 'Fechado' },
];

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Status</Text>

      <View style={styles.row}>
        {statuses.map((status) => {
          const active = value === status.value;

          return (
            <TouchableOpacity
              key={status.value}
              onPress={() => onChange(status.value)}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {status.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.foreground,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },

  chipActive: {
    borderColor: colors.action,
    backgroundColor: '#FEF2F2',
  },

  chipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.muted,
  },

  chipTextActive: {
    color: colors.action,
  },
});
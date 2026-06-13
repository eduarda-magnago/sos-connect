import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius } from '../../constants/theme';

type StatusSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  const isClosed = value === 'closed';

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Status manual</Text>

      <TouchableOpacity
        onPress={() => onChange(isClosed ? 'open' : 'closed')}
        style={[styles.chip, isClosed && styles.chipActive]}
        activeOpacity={0.8}
      >
        <Text style={[styles.chipText, isClosed && styles.chipTextActive]}>
          Fechado
        </Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Disponivel ou lotado sera calculado pela ocupacao atual.
      </Text>
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

  chip: {
    minHeight: 42,
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

  hint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
});

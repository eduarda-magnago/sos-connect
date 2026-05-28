import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants/theme';

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, active && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  chipActive: {
    borderColor: colors.action,
    backgroundColor: '#FEF2F2',
  },

  text: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: fonts.medium,
  },

  textActive: {
    color: colors.action,
  },
});
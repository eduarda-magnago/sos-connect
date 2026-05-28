import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../../constants/theme';

type StatusBadgeProps = {
  label: string;
  color: string;
};

export function StatusBadge({ label, color }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  text: {
    fontSize: 11,
    fontFamily: fonts.medium,
  },
});
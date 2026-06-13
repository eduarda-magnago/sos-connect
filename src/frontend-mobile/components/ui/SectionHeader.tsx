import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../constants/theme';

type SectionHeaderProps = {
  title: string;
  rightText?: string;
};

export function SectionHeader({ title, rightText }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {rightText ? (
        <Text style={styles.rightText}>{rightText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.foreground,
  },

  rightText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
});

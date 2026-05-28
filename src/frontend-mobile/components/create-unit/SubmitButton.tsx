import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type SubmitButtonProps = {
  title: string;
  loading: boolean;
  onPress: () => void;
};

export function SubmitButton({ title, loading, onPress }: SubmitButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  text: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 15,
  },
});
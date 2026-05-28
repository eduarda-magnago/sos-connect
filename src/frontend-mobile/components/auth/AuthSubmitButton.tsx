import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type AuthSubmitButtonProps = {
  title: string;
  loading: boolean;
  onPress: () => void;
};

export function AuthSubmitButton({
  title,
  loading,
  onPress,
}: AuthSubmitButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
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
    backgroundColor: colors.action,
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
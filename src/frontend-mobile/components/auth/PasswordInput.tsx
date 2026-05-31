import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type PasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  testID?: string;
};

export function PasswordInput({
  label,
  value,
  onChangeText,
  visible,
  onToggleVisible,
  testID,
}: PasswordInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputRow}>
        <TextInput
          testID={testID}
          style={styles.input}
          placeholder="••••••••••••"
          placeholderTextColor={colors.muted}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
        />

        <TouchableOpacity onPress={onToggleVisible} style={styles.eyeButton}>
          <Ionicons
            name={visible ? 'eye-off' : 'eye'}
            size={20}
            color={colors.muted}
          />
        </TouchableOpacity>
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

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
  },

  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.foreground,
    backgroundColor: colors.card,
  },

  eyeButton: {
    paddingHorizontal: spacing.sm,
  },
});
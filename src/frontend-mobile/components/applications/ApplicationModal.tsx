import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type ApplicationModalProps = {
  visible: boolean;
  title: string;
  defaultName?: string;
  defaultEmail?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    availableOnSchedule: boolean;
  }) => void;
};

export function ApplicationModal({
  visible,
  title,
  defaultName = '',
  defaultEmail = '',
  loading = false,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [availableOnSchedule, setAvailableOnSchedule] = useState(true);

  useEffect(() => {
    if (visible) {
      setName(defaultName);
      setEmail(defaultEmail);
      setAvailableOnSchedule(true);
    }
  }, [defaultEmail, defaultName, visible]);

  const disabled = loading || !name.trim() || !email.trim();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Confirmar candidatura</Text>
              <Text style={styles.subtitle}>{title}</Text>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                testID="application-name-input"
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                testID="application-email-input"
                style={styles.input}
                placeholder="email@gmail.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Possui disponibilidade no horário?</Text>
              <View style={styles.segmented}>
                <Option
                  label="Sim"
                  selected={availableOnSchedule}
                  onPress={() => setAvailableOnSchedule(true)}
                />
                <Option
                  label="Não"
                  selected={!availableOnSchedule}
                  onPress={() => setAvailableOnSchedule(false)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            testID="application-submit-button"
            style={[styles.submit, disabled && styles.submitDisabled]}
            disabled={disabled}
            activeOpacity={0.85}
            onPress={() =>
              onSubmit({
                name: name.trim(),
                email: email.trim(),
                availableOnSchedule,
              })
            }
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Enviar candidatura</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Option({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted,
    alignSelf: 'center',
    marginBottom: spacing.md,
    opacity: 0.35,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.foreground,
  },

  subtitle: {
    marginTop: 3,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },

  fields: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  field: {
    gap: 6,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.foreground,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.foreground,
    backgroundColor: colors.background,
  },

  segmented: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 11,
    alignItems: 'center',
  },

  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  optionText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.muted,
  },

  optionTextSelected: {
    color: '#fff',
  },

  submit: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
  },

  submitDisabled: {
    opacity: 0.5,
  },

  submitText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#fff',
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type RoleSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const roles = [
  { value: 'victim', label: 'Vítima' },
  { value: 'volunteer', label: 'Voluntário' },
  { value: 'support_unit', label: 'Instituição' },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Tipo de conta</Text>

      <View style={styles.row}>
        {roles.map((role) => {
          const active = value === role.value;

          return (
            <TouchableOpacity
              key={role.value}
              onPress={() => onChange(role.value)}
              style={[styles.roleButton, active && styles.roleButtonActive]}
            >
              <Text style={[styles.roleText, active && styles.roleTextActive]}>
                {role.label}
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

  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },

  roleButtonActive: {
    borderColor: colors.action,
    backgroundColor: '#FEF2F2',
  },

  roleText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.muted,
  },

  roleTextActive: {
    color: colors.action,
  },
});
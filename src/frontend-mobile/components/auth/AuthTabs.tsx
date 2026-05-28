import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, spacing } from '../../constants/theme';

type AuthTab = 'login' | 'register';

type AuthTabsProps = {
  value: AuthTab;
  onChange: (value: AuthTab) => void;
};

export function AuthTabs({ value, onChange }: AuthTabsProps) {
  return (
    <View style={styles.tabs}>
      {(['login', 'register'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onChange(tab)}
          style={[styles.tab, value === tab && styles.tabActive]}
        >
          <Text style={[styles.tabText, value === tab && styles.tabTextActive]}>
            {tab === 'login' ? 'Entrar' : 'Criar conta'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: 'center',
  },

  tabActive: {
    borderBottomWidth: 2,
    borderColor: colors.action,
  },

  tabText: {
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 14,
  },

  tabTextActive: {
    color: colors.foreground,
  },
});
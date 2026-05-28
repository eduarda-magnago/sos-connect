import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

type HeaderTitleProps = {
  userName?: string;
};

export function HeaderTitle({ userName }: HeaderTitleProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const firstName = userName?.split(' ')[0] || 'usuário';

  async function handleLogout() {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.subtitle}>Bem-vindo(a), </Text>
        <Text style={styles.title} numberOfLines={1}>
          {firstName}!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.avatarButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Ionicons name="person" size={20} color={colors.muted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: fonts.regular,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fonts.bold,
    flexShrink: 1,
  },

  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
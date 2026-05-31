import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts, spacing } from '../../constants/theme';

import { AuthBrandHeader } from '../../components/auth/AuthBrandHeader';
import { AuthTabs } from '../../components/auth/AuthTabs';
import { AuthInput } from '../../components/auth/AuthInput';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { AuthSubmitButton } from '../../components/auth/AuthSubmitButton';

export default function Login() {
  const router = useRouter();
  const { login, register } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('volunteer');

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      router.replace('/(app)/home' as any);
    } catch {
      Alert.alert('Erro', 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!regName || !regEmail || !regPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole as 'victim' | 'volunteer' | 'support_unit',
      });

      router.replace('/(app)/home' as any);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AuthBrandHeader />

        <View style={styles.form}>
          <AuthTabs value={tab} onChange={setTab} />

          {tab === 'login' ? (
            <View style={styles.fields}>
              <Text style={styles.formTitle}>Bem-vindo(a) de volta!</Text>
              <Text style={styles.formSubtitle}>Faça login para acessar sua conta.</Text>

              <AuthInput
                testID="login-email-input"
                label="E-mail"
                placeholder="email@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <PasswordInput
                testID="login-password-input"
                label="Senha"
                value={password}
                onChangeText={setPassword}
                visible={showPass}
                onToggleVisible={() => setShowPass(!showPass)}
              />

              <AuthSubmitButton
                testID="login-submit-button"
                title="Entrar"
                loading={loading}
                onPress={handleLogin}
              />

              <TouchableOpacity onPress={() => setTab('register')}>
                <Text style={styles.switchText}>
                  Ainda não tem uma conta?{' '}
                  <Text style={styles.switchLink}>Criar conta</Text>
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.fields}>
              <Text style={styles.formTitle}>Crie sua conta na SOS Connect!</Text>
              <Text style={styles.formSubtitle}>Preencha seus dados abaixo.</Text>

              <AuthInput
                label="Nome"
                placeholder="Digite seu nome"
                value={regName}
                onChangeText={setRegName}
              />

              <AuthInput
                label="E-mail"
                placeholder="email@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={regEmail}
                onChangeText={setRegEmail}
              />

              <PasswordInput
                label="Senha"
                value={regPassword}
                onChangeText={setRegPassword}
                visible={showPass}
                onToggleVisible={() => setShowPass(!showPass)}
              />

              <RoleSelector
                value={regRole}
                onChange={setRegRole}
              />

              <AuthSubmitButton
                title="Criar conta"
                loading={loading}
                onPress={handleRegister}
              />

              <TouchableOpacity onPress={() => setTab('login')}>
                <Text style={styles.switchText}>
                  Já tem uma conta?{' '}
                  <Text style={styles.switchLink}>Entrar</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sidebar,
  },

  scroll: {
    flexGrow: 1,
  },

  form: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },

  fields: {
    gap: spacing.md,
  },

  formTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.foreground,
  },

  formSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: -8,
  },

  switchText: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    fontFamily: fonts.regular,
  },

  switchLink: {
    color: colors.action,
    fontFamily: fonts.medium,
  },
});
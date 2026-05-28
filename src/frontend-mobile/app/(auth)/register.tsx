import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants/theme';

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <Text style={styles.subtitle}>Tela em construção.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.foreground,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
});
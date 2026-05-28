import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/theme';

export function AuthBrandHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo_sos_connect.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.appName}>SOS Connect</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 76,
    paddingBottom: 20,
    backgroundColor: colors.sidebar,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 14,
  },

  appName: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 26,
    letterSpacing: 0.2,
  },
});
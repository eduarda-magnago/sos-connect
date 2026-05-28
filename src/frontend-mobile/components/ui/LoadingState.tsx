import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/theme';

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.action} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
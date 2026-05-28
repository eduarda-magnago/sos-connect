import { Redirect } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '../constants/theme'

export default function Index() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.sidebar }}>
        <ActivityIndicator size="large" color={colors.action} />
      </View>
    )
  }

  return <Redirect href={isAuthenticated ? '/(app)/home' : '/(auth)/login'} />
}
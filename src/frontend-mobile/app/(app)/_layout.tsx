import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { colors, fonts } from '../../constants/theme';
import { HeaderTitle } from '../../components/home/HeaderTitle';

export default function AppLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const isVolunteer = user?.role === 'volunteer';
  const isSupportUnit = user?.role === 'support_unit';

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.sidebar,
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: fonts.bold,
        },

        tabBarStyle: {
          backgroundColor: colors.sidebar,
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 10),
        },

        tabBarItemStyle: {
          paddingVertical: 4,
        },

        tabBarActiveTintColor: colors.action,
        tabBarInactiveTintColor: '#6B7280',

        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 11,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          headerTitle: () => <HeaderTitle userName={user?.name} />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="support-units"
        options={{
          title: 'Unidades',
          headerTitle: 'Unidades',
          tabBarButtonTestID: 'tab-support-units',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-unit"
        options={{
          title: 'Nova Unidade',
          headerTitle: 'Nova Unidade',
          href: isSupportUnit ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="candidatures"
        options={{
          title: 'Candidaturas',
          headerTitle: 'Candidaturas',
          href: isVolunteer || isSupportUnit ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="certificates"
        options={{
          title: 'Certificados',
          headerTitle: 'Certificados',
          href: isVolunteer ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ribbon-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
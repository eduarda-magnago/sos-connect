import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { colors, fonts } from "../../constants/theme";
import { HeaderTitle } from "../../components/home/HeaderTitle";
import { getMediaUrl } from "../../services/media";

export default function AppLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  if (!loading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  const isVolunteer = user?.role === "volunteer";
  const isSupportUnit = user?.role === "support_unit";
  const avatarUrl = getMediaUrl(user?.avatar);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.sidebar,
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: fonts.bold,
        },

        tabBarStyle: {
          backgroundColor: colors.sidebar,
          borderTopColor: "rgba(255,255,255,0.1)",
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 10),
        },

        tabBarItemStyle: {
          paddingVertical: 4,
        },

        tabBarActiveTintColor: colors.action,
        tabBarInactiveTintColor: "#6B7280",
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
          title: "Início",
          headerTitle: "",
          headerRightContainerStyle: {
            paddingRight: 16,
          },
          headerLeft: () => (
            <View style={styles.headerProfile}>
              <TouchableOpacity
                style={styles.headerIconButton}
                activeOpacity={0.8}
                onPress={() => router.push("/(app)/settings" as any)}
              >
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
                ) : (
                  <Ionicons name="person" size={20} color={colors.muted} />
                )}
              </TouchableOpacity>
              <HeaderTitle userName={user?.name} userRole={user?.role} />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerIconButton}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert("Notificações", "Funcionalidade em desenvolvimento.")
              }
            >
              <Ionicons name="notifications-outline" size={20} color={colors.muted} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="support-units"
        options={{
          title: "Unidades",
          headerTitle: "Unidades",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-unit"
        options={{
          title: "Nova Unidade",
          headerTitle: "Nova Unidade",
          href: isSupportUnit ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="candidatures"
        options={{
          title: "Candidaturas",
          headerTitle: "Candidaturas",
          href: isVolunteer || isSupportUnit ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="certificates"
        options={{
          title: "Certificados",
          headerTitle: "Certificados",
          href: isVolunteer ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ribbon-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          headerTitle: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    gap: 10,
  },

  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  headerAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 19,
  },
});

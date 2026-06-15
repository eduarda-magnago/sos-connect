import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { colors, fonts } from "../../constants/theme";
import { HeaderTitle } from "../../components/home/HeaderTitle";
import { getMediaUrl } from "../../services/media";
import { showInfo } from "../../components/ui/FeedbackProvider";

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
  const isAdmin = user?.role === "admin";

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
          height: 56 + insets.bottom,
          paddingTop: 5,
          paddingBottom: Math.max(insets.bottom, 7),
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: colors.sidebar,
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -3 },
        },

        tabBarItemStyle: {
          height: 48,
          justifyContent: "center",
        },

        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.48)",

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
                showInfo("Notificações", "Essa área estará disponível em breve.")
              }
            >
              <Ionicons name="notifications-outline" size={20} color={colors.muted} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" color={color} label="Início" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="support-units"
        options={{
          title: "Unidades",
          headerTitle: "Unidades",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="business-outline" color={color} label="Unidades" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="create-unit"
        options={{
          title: "Nova Unidade",
          headerTitle: "Nova Unidade",
          href: isSupportUnit ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.centerTabButton, focused && styles.centerTabButtonActive]}>
              <Ionicons name="add" size={27} color="#fff" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="candidatures"
        options={{
          title: "Candidaturas",
          headerTitle: "Candidaturas",
          href: isVolunteer || isSupportUnit ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="clipboard-outline" color={color} label="Candid." focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="certificates"
        options={{
          title: "Certificados",
          headerTitle: "Certificados",
          href: isVolunteer || isAdmin ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="ribbon-outline" color={color} label="Certif." focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Perfil",
          headerTitle: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" color={color} label="Perfil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  color,
  label,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIcon}>
      <Ionicons name={name} size={22} color={color} />
      {focused ? <Text style={styles.tabLabel}>{label}</Text> : null}
    </View>
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

  centerTabButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.action,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  centerTabButtonActive: {
    backgroundColor: colors.action,
  },

  tabIcon: {
    minWidth: 52,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },

  tabLabel: {
    fontFamily: fonts.semibold,
    fontSize: 9.5,
    color: "#fff",
  },
});

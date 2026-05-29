import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const modalScreenOptions = {
  presentation: "modal" as const,
  headerShown: true,
  headerStyle: {
    backgroundColor: "#1a2744",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontFamily: "Roboto_700Bold",
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#1a2744" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />

        <Stack.Screen
          name="unit/[unitId]"
          options={{ ...modalScreenOptions, title: "Detalhe da Unidade" }}
        />

        <Stack.Screen
          name="unit/[unitId]/edit"
          options={{ ...modalScreenOptions, title: "Editar Unidade" }}
        />

        <Stack.Screen
          name="unit/[unitId]/donations"
          options={{ ...modalScreenOptions, title: "Necessidades de Doação" }}
        />
      </Stack>
    </AuthProvider>
  );
}
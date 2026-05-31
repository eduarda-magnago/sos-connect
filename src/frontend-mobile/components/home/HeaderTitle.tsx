import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../constants/theme";

type HeaderTitleProps = {
  userName?: string;
  userRole?: string;
};

function getFirstName(name?: string) {
  return name?.trim().split(" ")[0] || "bem-vindo";
}

function getHeaderText(userName?: string, userRole?: string) {
  const firstName = getFirstName(userName);

  if (userRole === "victim") {
    return {
      title: `Olá, ${firstName}`,
      subtitle: "Encontre ajuda perto de você",
    };
  }

  if (userRole === "volunteer") {
    return {
      title: `Olá, ${firstName}`,
      subtitle: "Encontre missões para ajudar",
    };
  }

  if (userRole === "support_unit") {
    return {
      title: userName || "Minha instituição",
      subtitle: "Gerencie unidades, missões e doações",
    };
  }

  if (userRole === "admin") {
    return {
      title: "Painel administrativo",
      subtitle: "Valide unidades e acompanhe atividades",
    };
  }

  return {
    title: `Olá, ${firstName}`,
    subtitle: "Acompanhe as novidades da SOS Connect",
  };
}

export function HeaderTitle({ userName, userRole }: HeaderTitleProps) {
  const { title, subtitle } = getHeaderText(userName, userRole);

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 220,
    alignItems: "flex-start",
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: "#fff",
  },

  subtitle: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.border,
  },
});

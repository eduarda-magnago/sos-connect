import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts, radius, spacing } from "../../constants/theme";
import { StatusBadge } from "../ui/StatusBadge";

type UnitHeaderProps = {
  name: string;
  imageUrl?: string;
  statusLabel: string;
  statusColor: string;
};

export function UnitHeader({
  name,
  imageUrl,
  statusLabel,
  statusColor,
}: UnitHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageArea}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="business" size={42} color={colors.muted} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.iconBadge}>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
        </View>

        <StatusBadge label={statusLabel} color={statusColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    overflow: "hidden",
  },

  imageArea: {
    width: "100%",
    height: 170,
    backgroundColor: "#EEF2F7",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: "flex-start",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeholder: {
    width: 78,
    height: 78,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.foreground,
  },
});

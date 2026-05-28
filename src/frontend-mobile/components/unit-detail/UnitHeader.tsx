import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, fonts, spacing } from '../../constants/theme';
import { StatusBadge } from '../ui/StatusBadge';

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
    <View>
      <View style={styles.imageArea}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Ionicons name="business" size={46} color={colors.muted} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>

        <StatusBadge label={statusLabel} color={statusColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageArea: {
    width: '100%',
    height: 180,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },

  name: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.foreground,
  },
});
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type ImagePickerFieldProps = {
  image: string | null;
  onPress: () => void;
  loading?: boolean;
};

export function ImagePickerField({ image, onPress, loading = false }: ImagePickerFieldProps) {
  return (
    <TouchableOpacity
      style={styles.imageArea}
      onPress={onPress}
      activeOpacity={0.82}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.placeholderText}>Enviando imagem...</Text>
        </View>
      ) : image ? (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera-outline" size={26} color={colors.primary} />
          </View>

          <Text style={styles.placeholderTitle}>Adicione uma foto da unidade</Text>
          <Text style={styles.placeholderText}>
            Uma imagem ajuda as pessoas a reconhecerem o local.
          </Text>

          <Text style={styles.buttonText}>Escolher imagem</Text>
        </View>
      )}

      {!loading && image ? (
        <View style={styles.overlay}>
          <Ionicons name="camera" size={22} color={colors.card} />
          <Text style={styles.overlayText}>Trocar foto</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageArea: {
    minHeight: 188,
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    overflow: 'hidden',
    elevation: 1,
  },

  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  overlayText: {
    fontSize: 13,
    color: colors.card,
    fontFamily: fonts.medium,
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderTitle: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },

  placeholderText: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 18,
  },

  buttonText: {
    fontSize: 13,
    color: '#fff',
    fontFamily: fonts.semibold,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
});

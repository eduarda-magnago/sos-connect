import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../../constants/theme';

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
      activeOpacity={0.8}
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
          <Ionicons name="camera-outline" size={32} color={colors.muted} />

          <Text style={styles.placeholderText}>
            Adicione uma foto da sua unidade de apoio.
          </Text>

          <Text style={styles.buttonText}>Escolher arquivo</Text>
        </View>
      )}

      {!loading && image ? (
        <View style={styles.overlay}>
          <Ionicons name="camera" size={24} color={colors.card} />
          <Text style={styles.overlayText}>Trocar foto</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageArea: {
    width: '100%',
    height: 180,
    backgroundColor: colors.card,
  },

  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
    gap: 8,
  },

  placeholderText: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: fonts.regular,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },

  buttonText: {
    fontSize: 13,
    color: colors.foreground,
    fontFamily: fonts.medium,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

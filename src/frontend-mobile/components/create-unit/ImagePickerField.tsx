import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../../constants/theme';

type ImagePickerFieldProps = {
  image: string | null;
  onPress: () => void;
};

export function ImagePickerField({ image, onPress }: ImagePickerFieldProps) {
  return (
    <TouchableOpacity style={styles.imageArea} onPress={onPress} activeOpacity={0.8}>
      {image ? (
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
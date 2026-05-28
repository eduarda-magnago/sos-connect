import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../../constants/theme';

type CoordinateFieldsProps = {
  latitude: string;
  longitude: string;
  onChangeLatitude: (value: string) => void;
  onChangeLongitude: (value: string) => void;
  onUseCurrentLocation: () => void;
};

export function CoordinateFields({
  latitude,
  longitude,
  onChangeLatitude,
  onChangeLongitude,
  onUseCurrentLocation,
}: CoordinateFieldsProps) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Coordenadas *</Text>

        <TouchableOpacity onPress={onUseCurrentLocation}>
          <Text style={styles.locationButton}>Usar minha localização</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="Latitude"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          value={latitude}
          onChangeText={onChangeLatitude}
        />

        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="Longitude"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          value={longitude}
          onChangeText={onChangeLongitude}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.foreground,
  },

  locationButton: {
    fontSize: 12,
    color: colors.action,
    fontFamily: fonts.medium,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  flex: {
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.foreground,
    backgroundColor: colors.card,
  },
});
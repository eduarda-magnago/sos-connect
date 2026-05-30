import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts, spacing } from "../../constants/theme";

export type MapFilterValues = {
  status: string;
  services: string[];
  minAvailableCapacity: number | null;
  radius: number | null;
};

export const EMPTY_FILTERS: MapFilterValues = {
  status: "",
  services: [],
  minAvailableCapacity: null,
  radius: null,
};

export function countActiveFilters(f: MapFilterValues): number {
  return (
    (f.status ? 1 : 0) +
    (f.services.length > 0 ? 1 : 0) +
    (f.minAvailableCapacity != null ? 1 : 0) +
    (f.radius != null ? 1 : 0)
  );
}

const STATUS_OPTIONS = [
  { key: "open", label: "Disponível" },
  { key: "full", label: "Lotado" },
  { key: "closed", label: "Fechado" },
];

const CAPACITY_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Qualquer", value: null },
  { label: "1+", value: 1 },
  { label: "5+", value: 5 },
  { label: "10+", value: 10 },
  { label: "20+", value: 20 },
];

const RADIUS_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Qualquer", value: null },
  { label: "1 km", value: 1000 },
  { label: "5 km", value: 5000 },
  { label: "10 km", value: 10000 },
  { label: "25 km", value: 25000 },
];

type Props = {
  visible: boolean;
  initial: MapFilterValues;
  serviceOptions: string[];
  hasLocation: boolean;
  onClose: () => void;
  onApply: (values: MapFilterValues) => void;
};

export function MapFilters({
  visible,
  initial,
  serviceOptions,
  hasLocation,
  onClose,
  onApply,
}: Props) {
  const [status, setStatus] = useState(initial.status);
  const [services, setServices] = useState<string[]>(initial.services);
  const [capacity, setCapacity] = useState<number | null>(
    initial.minAvailableCapacity
  );
  const [radius, setRadius] = useState<number | null>(initial.radius);

  useEffect(() => {
    setStatus(initial.status);
    setServices(initial.services);
    setCapacity(initial.minAvailableCapacity);
    setRadius(initial.radius);
  }, [initial, visible]);

  function toggleService(value: string) {
    setServices((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  }

  function handleClear() {
    setStatus("");
    setServices([]);
    setCapacity(null);
    setRadius(null);
  }

  function handleApply() {
    onApply({
      status,
      services,
      minAvailableCapacity: capacity,
      radius,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>Filtrar unidades</Text>
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.fields}>
                <View>
                  <Text style={styles.label}>Status</Text>
                  <View style={styles.chipRow}>
                    {STATUS_OPTIONS.map((opt) => {
                      const selected = status === opt.key;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          style={[styles.chip, selected && styles.chipSelected]}
                          onPress={() =>
                            setStatus(selected ? "" : opt.key)
                          }
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.chipTextSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Tipo de serviço</Text>
                  {serviceOptions.length === 0 ? (
                    <Text style={styles.emptyHint}>
                      Nenhum serviço disponível nas unidades.
                    </Text>
                  ) : (
                    <View style={styles.chipRow}>
                      {serviceOptions.map((service) => {
                        const selected = services.includes(service);
                        return (
                          <TouchableOpacity
                            key={service}
                            style={[
                              styles.chip,
                              selected && styles.chipSelected,
                            ]}
                            onPress={() => toggleService(service)}
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                selected && styles.chipTextSelected,
                              ]}
                            >
                              {service}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                <View>
                  <Text style={styles.label}>Capacidade disponível</Text>
                  <View style={styles.chipRow}>
                    {CAPACITY_OPTIONS.map((opt) => {
                      const selected = capacity === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.label}
                          style={[styles.chip, selected && styles.chipSelected]}
                          onPress={() => setCapacity(opt.value)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.chipTextSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text style={styles.label}>Raio de distância</Text>
                  {!hasLocation && (
                    <Text style={styles.emptyHint}>
                      Ative a localização para filtrar por distância.
                    </Text>
                  )}
                  <View style={styles.chipRow}>
                    {RADIUS_OPTIONS.map((opt) => {
                      const selected = radius === opt.value;
                      const disabled = !hasLocation && opt.value != null;
                      return (
                        <TouchableOpacity
                          key={opt.label}
                          style={[
                            styles.chip,
                            selected && styles.chipSelected,
                            disabled && styles.chipDisabled,
                          ]}
                          disabled={disabled}
                          onPress={() => setRadius(opt.value)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              selected && styles.chipTextSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnGhost]}
                    onPress={handleClear}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnGhostText}>Limpar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnPrimary]}
                    onPress={handleApply}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>Aplicar filtros</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
    maxHeight: "90%",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.md,
    paddingBottom: Platform.OS === "ios" ? 40 : spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted,
    alignSelf: "center",
    marginBottom: spacing.md,
    opacity: 0.35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.foreground,
  },
  fields: {
    gap: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  chipTextSelected: {
    color: "#fff",
    fontFamily: fonts.semibold,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnGhost: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnGhostText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.foreground,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: "#fff",
  },
});

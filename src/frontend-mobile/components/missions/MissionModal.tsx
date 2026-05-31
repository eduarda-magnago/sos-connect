import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { colors, fonts, spacing } from "../../constants/theme";
import { FormInput } from "../create-unit/FormInput";
import type { Mission } from "../../app/unit/[unitId]/missions";

export type MissionFormData = {
  title: string;
  description: string;
  category: string;
  volunteers_needed: number;
  date: string;
  contact_phone?: string;
  delivery_time?: string;
};

const CATEGORIES: { key: string; label: string }[] = [
  { key: "cozinha", label: "Cozinha" },
  { key: "limpeza", label: "Limpeza" },
  { key: "medico", label: "Médico" },
  { key: "transporte", label: "Transporte" },
  { key: "cuidado_infantil", label: "Cuidado Infantil" },
  { key: "construcao", label: "Construção" },
  { key: "distribuicao", label: "Distribuição" },
  { key: "outro", label: "Outro" },
];

type Props = {
  visible: boolean;
  mission: Mission | null;
  onClose: () => void;
  onSubmit: (data: MissionFormData) => Promise<void>;
};

export function MissionModal({ visible, mission, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cozinha");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mission) {
      setTitle(mission.title);
      setDescription(mission.description ?? "");
      setCategory(mission.category);
      setVolunteersNeeded(String(mission.volunteers_needed));
      setDate(mission.date ? new Date(mission.date) : null);
      setContactPhone((mission as any).contact_phone ?? "");
      setDeliveryTime((mission as any).delivery_time ?? "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("cozinha");
      setVolunteersNeeded("");
      setDate(null);
      setContactPhone("");
      setDeliveryTime("");
    }
    setShowDatePicker(false);
  }, [mission, visible]);

  const isValid =
    title.trim() &&
    description.trim() &&
    volunteersNeeded.trim() &&
    Number(volunteersNeeded) > 0 &&
    !!date;

  function onChangeDate(_event: DateTimePickerEvent, selected?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) setDate(selected);
  }

  async function handleSubmit() {
    if (!isValid || !date) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        volunteers_needed: parseInt(volunteersNeeded, 10),
        date: date.toISOString(),
        contact_phone: contactPhone.trim() || undefined,
        delivery_time: deliveryTime.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  const isEditing = !!mission;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrapper}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>
                {isEditing ? "Editar missão" : "Crie uma missão de ajuda"}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {!isEditing && (
              <Text style={styles.subtitle}>
                As missões cadastradas serão disponibilizadas para voluntários,
                permitindo a organização e execução de ações da unidade.
              </Text>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.fields}>
                <FormInput
                  testID="mission-title-input"
                  label="Nome da missão"
                  placeholder="Ex: Distribuição de cestas"
                  value={title}
                  onChangeText={setTitle}
                />

                <FormInput
                  testID="mission-description-input"
                  label="Descrição"
                  placeholder="Detalhes da missão"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />

                <View>
                  <Text style={styles.label}>Categoria</Text>
                  <View style={styles.categoryRow}>
                    {CATEGORIES.map((c) => {
                      const selected = category === c.key;
                      return (
                        <TouchableOpacity
                          key={c.key}
                          testID={`mission-category-${c.key}`}
                          style={[
                            styles.categoryBtn,
                            selected && styles.categoryBtnSelected,
                          ]}
                          onPress={() => setCategory(c.key)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.categoryBtnText,
                              selected && styles.categoryBtnTextSelected,
                            ]}
                          >
                            {c.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <FormInput
                  testID="mission-volunteers-input"
                  label="Voluntários necessários"
                  placeholder="Ex: 5"
                  value={volunteersNeeded}
                  keyboardType="numeric"
                  onChangeText={setVolunteersNeeded}
                />

                <View>
                  <Text style={styles.label}>Data</Text>
                  <TouchableOpacity
                    testID="mission-date-input"
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker((s) => !s)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.dateText, !date && styles.datePlaceholder]}
                    >
                      {date
                        ? date.toLocaleDateString("pt-BR")
                        : "Selecione a data"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={colors.muted}
                    />
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={date ?? new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      onChange={onChangeDate}
                    />
                  )}
                </View>

                <FormInput
                  label="Telefone de contato (opcional)"
                  placeholder="Digite o telefone"
                  value={contactPhone}
                  keyboardType="phone-pad"
                  onChangeText={setContactPhone}
                />

                <FormInput
                  label="Horário de entrega (opcional)"
                  placeholder="Digite o horário"
                  value={deliveryTime}
                  onChangeText={setDeliveryTime}
                />

                <TouchableOpacity
                  testID="mission-submit-button"
                  style={[styles.submit, (loading || !isValid) && styles.submitDisabled]}
                  onPress={handleSubmit}
                  disabled={loading || !isValid}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitText}>
                    {loading
                      ? "Salvando..."
                      : isEditing
                        ? "Salvar alterações"
                        : "Criar missão"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.foreground,
    flex: 1,
    paddingRight: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.md,
    lineHeight: 20,
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
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  dateText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.foreground,
  },
  datePlaceholder: {
    color: colors.muted,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border ?? colors.muted,
  },
  categoryBtnSelected: {
    backgroundColor: colors.action,
    borderColor: colors.action,
  },
  categoryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  categoryBtnTextSelected: {
    color: "#fff",
    fontFamily: fonts.semibold,
  },
  submit: {
    backgroundColor: colors.action,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#fff",
  },
});

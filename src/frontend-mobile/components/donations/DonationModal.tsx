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

import { colors, fonts, spacing } from "../../constants/theme";
import { FormInput } from "../create-unit/FormInput";
import type { Donation } from "../../app/donations/donations";

const PRIORITIES: {
  key: Donation["priority"];
  label: string;
  color: string;
}[] = [
  { key: "low", label: "Baixa", color: colors.success },
  { key: "medium", label: "Média", color: colors.warning },
  { key: "high", label: "Alta", color: "#F97316" },
  { key: "critical", label: "Crítica", color: colors.danger },
];

type Props = {
  visible: boolean;
  donation: Donation | null;
  onClose: () => void;
  onSubmit: (data: Omit<Donation, "_id" | "support_unit_id">) => Promise<void>;
};

export function DonationModal({ visible, donation, onClose, onSubmit }: Props) {
  const [item_name, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [priority, setPriority] = useState<Donation["priority"]>("medium");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donation) {
      setItemName(donation.item_name);
      setQuantity(String(donation.quantity_needed));
      setPriority(donation.priority);
    } else {
      setItemName("");
      setQuantity("");
      setPriority("medium");
    }
  }, [donation, visible]);

  async function handleSubmit() {
    if (!item_name.trim() || !quantity.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        item_name: item_name.trim(),
        quantity_needed: parseInt(quantity, 10),
        priority,
      });
    } finally {
      setLoading(false);
    }
  }

  const isEditing = !!donation;

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
                {isEditing
                  ? "Editar necessidade"
                  : "Crie uma necessidade de doação"}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {!isEditing && (
              <Text style={styles.subtitle}>
                Informe o item e a quantidade necessária para que a unidade
                possa receber doações corretamente.
              </Text>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.fields}>
                <FormInput
                  label="Item"
                  placeholder="Ex: Cobertor"
                  value={item_name}
                  onChangeText={setItemName}
                />

                <FormInput
                  label="Quantidade necessária"
                  placeholder="Ex: 50"
                  value={quantity}
                  keyboardType="numeric"
                  onChangeText={setQuantity}
                />

                <View>
                  <Text style={styles.label}>Prioridade</Text>
                  <View style={styles.priorityRow}>
                    {PRIORITIES.map((p) => {
                      const selected = priority === p.key;
                      return (
                        <TouchableOpacity
                          key={p.key}
                          style={[
                            styles.priorityBtn,
                            selected && {
                              backgroundColor: p.color,
                              borderColor: p.color,
                            },
                          ]}
                          onPress={() => setPriority(p.key)}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.priorityBtnText,
                              selected && styles.priorityBtnTextSelected,
                            ]}
                          >
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submit,
                    (loading || !item_name.trim() || !quantity.trim()) &&
                      styles.submitDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading || !item_name.trim() || !quantity.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitText}>
                    {loading
                      ? "Salvando..."
                      : isEditing
                        ? "Salvar alterações"
                        : "Criar necessidade"}
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
  priorityRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border ?? colors.muted,
    alignItems: "center",
  },
  priorityBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
  },
  priorityBtnTextSelected: {
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

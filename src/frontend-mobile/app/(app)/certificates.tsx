import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "../../services/api";
import { colors, fonts, spacing } from "../../constants/theme";
import { LoadingState } from "../../components/ui/LoadingState";
import { showError, showSuccess } from "../../components/ui/FeedbackProvider";
import { useAuth } from "../../contexts/AuthContext";

type Certificate = {
  _id: string;
  user_id: string;
  mission_id: string;
  support_unit_id: string;
  issued_by: string;
  hours: number;
  certificate_code: string;
  issued_at: string;
  mission?: {
    _id: string;
    title: string;
    description?: string;
  };
  supportUnit?: {
    _id: string;
    name: string;
  };
};

type MissionVolunteerApplication = {
  _id: string;
  status: string;
  mission_id:
    | string
    | {
        _id: string;
        title: string;
      };
  user_id:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
};

export default function Certificates() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminCertificates />;
  }

  return <VolunteerCertificates />;
}

function AdminCertificates() {
  const [applications, setApplications] = useState<MissionVolunteerApplication[]>(
    []
  );
  const [hoursByApplication, setHoursByApplication] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadApprovedApplications();
    }, [])
  );

  async function loadApprovedApplications() {
    setLoading(true);
  
    try {
      const [applicationsResponse, certificatesResponse] = await Promise.all([
        api.get("/mission-volunteers"),
        api.get("/certificates"),
      ]);
  
      const issuedCertificates = new Set(
        certificatesResponse.data.map((certificate: Certificate) => {
          return `${certificate.mission_id}:${certificate.user_id}`;
        })
      );
  
      const approvedApplications = applicationsResponse.data.filter(
        (application: MissionVolunteerApplication) => {
          const missionId = getMissionId(application);
          const volunteerId = getVolunteerId(application);
  
          if (!missionId || !volunteerId) return false;
  
          const alreadyIssued = issuedCertificates.has(
            `${missionId}:${volunteerId}`
          );
  
          return application.status === "approved" && !alreadyIssued;
        }
      );
  
      setApplications(approvedApplications);
    } catch (error) {
      console.error(error);
      showError("Não foi possível carregar", "Os certificados não puderam ser carregados agora.");
    } finally {
      setLoading(false);
    }
  }

  async function handleIssueCertificate(application: MissionVolunteerApplication) {
    const missionId = getMissionId(application);
    const volunteerId = getVolunteerId(application);
    const hours = Number(hoursByApplication[application._id]);

    if (!missionId || !volunteerId) {
      showError("Erro", "Dados da missão ou do voluntário estão incompletos.");
      return;
    }

    if (!hours || hours < 1) {
      showError("Atenção", "Informe uma carga horária válida.");
      return;
    }

    try {
      setProcessingId(application._id);

      await api.post("/certificates", {
        mission_id: missionId,
        volunteer_user_id: volunteerId,
        hours,
      });

      showSuccess("Sucesso", "Certificado emitido com sucesso!");

      setApplications((prev) =>
        prev.filter((item) => item._id !== application._id)
      );

      setHoursByApplication((prev) => {
        const next = { ...prev };
        delete next[application._id];
        return next;
      });
    } catch (error: any) {
      console.error("Erro ao emitir:", error?.response?.data ?? error);

      const message = error?.response?.data?.message;

      showError(
        "Erro",
        Array.isArray(message)
          ? message.join("\n")
          : message ?? "Não foi possível emitir o certificado."
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="ribbon-outline" size={48} color={colors.muted} />

            <Text style={styles.emptyTitle}>Nenhum voluntário aprovado</Text>

            <Text style={styles.emptySubtitle}>
              Quando houver participações aprovadas em missões, elas aparecerão
              aqui para emissão de certificados.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isProcessing = processingId === item._id;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons name="ribbon-outline" size={22} color="#fff" />
                </View>

                <View style={styles.headerTextBox}>
                  <Text style={styles.title} numberOfLines={2}>
                    {getMissionTitle(item)}
                  </Text>

                  <Text style={styles.subtitle} numberOfLines={1}>
                    Voluntário: {getVolunteerName(item)}
                  </Text>

                  {!!getVolunteerEmail(item) && (
                    <Text style={styles.subtitle} numberOfLines={1}>
                      {getVolunteerEmail(item)}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.divider} />

              <TextInput
                style={styles.input}
                placeholder="Carga horária"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={hoursByApplication[item._id] ?? ""}
                onChangeText={(value) =>
                  setHoursByApplication((prev) => ({
                    ...prev,
                    [item._id]: value,
                  }))
                }
              />

              <TouchableOpacity
                style={[styles.button, isProcessing && styles.buttonDisabled]}
                onPress={() => handleIssueCertificate(item)}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <Ionicons name="document-text-outline" size={17} color="#fff" />

                <Text style={styles.buttonText}>
                  {isProcessing ? "Emitindo..." : "Emitir certificado"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

function VolunteerCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadCertificates();
    }, [])
  );

  async function loadCertificates() {
    setLoading(true);

    try {
      const response = await api.get("/certificates/me");

      const certificatesWithDetails = await Promise.all(
        response.data.map(async (certificate: Certificate) => {
          try {
            const [missionResponse, supportUnitResponse] = await Promise.all([
              api.get(`/missions/${certificate.mission_id}`),
              api.get(`/support-units/${certificate.support_unit_id}`),
            ]);

            return {
              ...certificate,
              mission: missionResponse.data,
              supportUnit: supportUnitResponse.data,
            };
          } catch {
            return certificate;
          }
        })
      );

      setCertificates(certificatesWithDetails);
    } catch (error) {
      console.error(error);
      showError("Erro", "Não foi possível carregar os certificados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(certificate: Certificate) {
    try {
      setProcessingId(certificate._id);

      await api.get(`/certificates/${certificate._id}/download`, {
        responseType: "arraybuffer",
      });

      showSuccess(
        "Certificado disponível",
        `O certificado ${certificate.certificate_code} foi localizado com sucesso.`
      );
    } catch (error) {
      console.error(error);
      showError("Erro", "Não foi possível acessar o certificado.");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <FlatList
        data={certificates}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="ribbon-outline" size={48} color={colors.muted} />

            <Text style={styles.emptyTitle}>
              Nenhum certificado encontrado
            </Text>

            <Text style={styles.emptySubtitle}>
              Quando uma instituição emitir certificados para suas participações
              em missões, eles aparecerão aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isProcessing = processingId === item._id;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons name="ribbon-outline" size={22} color="#fff" />
                </View>

                <View style={styles.headerTextBox}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.mission?.title ?? "Missão de voluntariado"}
                  </Text>

                  <Text style={styles.subtitle} numberOfLines={1}>
                    {item.supportUnit?.name ?? "Unidade de apoio"}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={colors.muted}
                />
                <Text style={styles.infoText}>
                  Carga horária: {item.hours}h
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={colors.muted}
                />
                <Text style={styles.infoText}>
                  Emitido em:{" "}
                  {new Date(item.issued_at).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={colors.muted}
                />
                <Text style={styles.infoText}>
                  Código: {item.certificate_code}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  isProcessing && styles.buttonDisabled,
                ]}
                onPress={() => handleDownload(item)}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="document-text-outline"
                  size={17}
                  color="#fff"
                />

                <Text style={styles.buttonText}>
                  {isProcessing ? "Carregando..." : "Ver certificado"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

function getMissionId(application: MissionVolunteerApplication) {
  return typeof application.mission_id === "string"
    ? application.mission_id
    : application.mission_id?._id;
}

function getMissionTitle(application: MissionVolunteerApplication) {
  return typeof application.mission_id === "string"
    ? "Missão"
    : application.mission_id?.title ?? "Missão";
}

function getVolunteerId(application: MissionVolunteerApplication) {
  return typeof application.user_id === "string"
    ? application.user_id
    : application.user_id?._id;
}

function getVolunteerName(application: MissionVolunteerApplication) {
  return typeof application.user_id === "string"
    ? "Voluntário"
    : application.user_id?.name ?? "Voluntário";
}

function getVolunteerEmail(application: MissionVolunteerApplication) {
  return typeof application.user_id === "string"
    ? ""
    : application.user_id?.email ?? "";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    padding: spacing.md,
    paddingBottom: 112,
    gap: spacing.sm,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.action,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextBox: {
    flex: 1,
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
  },

  subtitle: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },

  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.xs,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.foreground,
  },

  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.foreground,
  },

  button: {
    marginTop: spacing.sm,
    backgroundColor: "#142B45",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonDisabled: {
    backgroundColor: colors.muted,
  },

  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: "#fff",
  },

  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
    textAlign: "center",
  },

  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
  },
});
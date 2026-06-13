import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import api from '../../../services/api';
import { pickAndUploadImage, takeAndUploadPhoto } from '../../../services/upload';
import { colors, fonts, radius, spacing } from '../../../constants/theme';

import { LoadingState } from '../../../components/ui/LoadingState';
import { ImagePickerField } from '../../../components/create-unit/ImagePickerField';
import { FormInput } from '../../../components/create-unit/FormInput';
import { CoordinateFields } from '../../../components/create-unit/CoordinateFields';
import { StatusSelector } from '../../../components/create-unit/StatusSelector';
import { SubmitButton } from '../../../components/create-unit/SubmitButton';
import { showError, showInfo, showSuccess, showWarning } from '../../../components/ui/FeedbackProvider';

type EditUnitForm = {
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  description: string;
  services: string;
  status: string;
  capacity: string;
  currentOccupancy: string;
  lat: string;
  lng: string;
};

type SupportUnitResponse = {
  _id: string;
  name: string;
  CNPJ?: string;
  description?: string;
  status: string;
  capacity: number;
  current_occupancy?: number;
  contact?: {
    email?: string;
    phone?: string;
  };
  location?: {
    coordinates?: number[];
    lat?: number;
    lng?: number;
  };
  image_url?: string;
  services_available?: string[];
};

const initialForm: EditUnitForm = {
  name: '',
  email: '',
  phone: '',
  CNPJ: '',
  description: '',
  services: '',
  status: 'open',
  capacity: '',
  currentOccupancy: '0',
  lat: '',
  lng: '',
};

export default function EditUnitModal() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const unitId = Array.isArray(params.unitId)
    ? params.unitId[0]
    : params.unitId;

  const [form, setForm] = useState<EditUnitForm>(initialForm);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadUnit();
  }, [unitId]);

  function updateField(key: keyof EditUnitForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function parseServices(value: string) {
    return value
      .split(',')
      .map((service) => service.trim())
      .filter(Boolean);
  }

  function getComputedStatus(capacity: number, currentOccupancy: number) {
    if (form.status === 'closed') {
      return 'closed';
    }

    return currentOccupancy >= capacity ? 'full' : 'open';
  }

  async function loadUnit() {
    try {
      const response = await api.get(`/support-units/${unitId}`);
      const unit: SupportUnitResponse = response.data;
      const coordinates = unit.location?.coordinates;

      setImage(unit.image_url || null);
      setForm({
        name: unit.name || '',
        email: unit.contact?.email || '',
        phone: unit.contact?.phone || '',
        CNPJ: unit.CNPJ || '',
        description: unit.description || '',
        services: (unit.services_available || []).join(', '),
        status: unit.status || 'open',
        capacity: unit.capacity ? String(unit.capacity) : '',
        currentOccupancy:
          unit.current_occupancy !== undefined
            ? String(unit.current_occupancy)
            : '0',
        lat: coordinates?.[1]
          ? String(coordinates[1])
          : unit.location?.lat
            ? String(unit.location.lat)
            : '',
        lng: coordinates?.[0]
          ? String(coordinates[0])
          : unit.location?.lng
            ? String(unit.location.lng)
            : '',
      });
    } catch (error) {
      console.error(error);
      showError('Não foi possível carregar', 'Os dados da unidade não puderam ser carregados agora.');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  function showImageOptions() {
    Alert.alert('Escolher foto', 'De onde quer importar a imagem?', [
      { text: 'Galeria', onPress: () => uploadImage('gallery') },
      { text: 'Camera', onPress: () => uploadImage('camera') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function uploadImage(source: 'gallery' | 'camera') {
    setImageLoading(true);

    try {
      const url =
        source === 'gallery'
          ? await pickAndUploadImage('support-units')
          : await takeAndUploadPhoto('support-units');

      if (url) {
        setImage(url);
      }
    } catch (error: any) {
      showError(
        'Não foi possível enviar a imagem',
        error.message || 'Tente novamente em alguns instantes ou escolha outra foto.',
      );
    } finally {
      setImageLoading(false);
    }
  }

  function validateForm() {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.capacity ||
      form.currentOccupancy === '' ||
      !form.lat ||
      !form.lng
    ) {
      showWarning('Campos obrigatórios', 'Preencha todos os campos marcados com asterisco.');
      return false;
    }

    return true;
  }

  async function handleUpdate() {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    const capacity = parseInt(form.capacity, 10);
    const currentOccupancy = parseInt(form.currentOccupancy, 10);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      showWarning('Coordenadas inválidas', 'Latitude e longitude precisam ser válidas.');
      setSaving(false);
      return;
    }

    if (Number.isNaN(capacity) || Number.isNaN(currentOccupancy)) {
      showWarning('Dados inválidos', 'Capacidade e ocupação atual precisam ser números válidos.');
      setSaving(false);
      return;
    }

    if (capacity < 1 || currentOccupancy < 0) {
      showWarning('Capacidade inválida', 'Capacidade deve ser maior que zero e ocupação atual não pode ser negativa.');
      setSaving(false);
      return;
    }

    if (currentOccupancy > capacity) {
      showWarning('Ocupação inválida', 'A ocupação atual não pode ser maior que a capacidade.');
      setSaving(false);
      return;
    }

    try {
      await api.put(`/support-units/${unitId}`, {
        name: form.name,
        description: form.description,
        contact: {
          email: form.email,
          phone: form.phone,
        },
        location: {
          lat,
          lng,
        },
        capacity,
        current_occupancy: currentOccupancy,
        status: getComputedStatus(capacity, currentOccupancy),
        image_url: image,
        services_available: parseServices(form.services),
      });

      showSuccess('Unidade atualizada', 'Os dados da unidade foram salvos com sucesso.', () =>
        router.back(),
      );
    } catch (error: any) {
      console.error('Erro ao atualizar unidade:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      showError('Não foi possível salvar', 'Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ImagePickerField
          image={image}
          onPress={showImageOptions}
          loading={imageLoading}
        />

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados da unidade</Text>

          <FormInput
            label="Nome da Instituição *"
            placeholder="Digite o nome"
            value={form.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <CoordinateFields
            latitude={form.lat}
            longitude={form.lng}
            onChangeLatitude={(value) => updateField('lat', value)}
            onChangeLongitude={(value) => updateField('lng', value)}
            onUseCurrentLocation={() => {
              showInfo(
                'Localização',
                'Em breve você poderá atualizar as coordenadas usando sua localização atual.',
              );
            }}
          />

          <FormInput
            label="E-mail *"
            placeholder="email@gmail.com"
            value={form.email}
            keyboardType="email-address"
            onChangeText={(value) => updateField('email', value)}
          />

          <View style={styles.row}>
            <View style={styles.flex}>
              <FormInput
                label="Telefone *"
                placeholder="(85) 99999-0000"
                value={form.phone}
                keyboardType="phone-pad"
                onChangeText={(value) => updateField('phone', value)}
              />
            </View>
          </View>

          <FormInput
            label="Descrição"
            placeholder="Faça uma descrição"
            value={form.description}
            multiline
            onChangeText={(value) => updateField('description', value)}
          />

          <FormInput
            label="Serviços disponíveis"
            placeholder="Ex: alimentação, abrigo, água"
            value={form.services}
            multiline
            onChangeText={(value) => updateField('services', value)}
          />

          <StatusSelector
            value={form.status}
            onChange={(value) => updateField('status', value)}
          />

          <FormInput
            label="Capacidade *"
            placeholder="000"
            value={form.capacity}
            keyboardType="numeric"
            onChangeText={(value) => updateField('capacity', value)}
          />

          <FormInput
            label="Ocupação atual *"
            placeholder="0"
            value={form.currentOccupancy}
            keyboardType="numeric"
            onChangeText={(value) => updateField('currentOccupancy', value)}
          />

          <SubmitButton
            title="Salvar alterações"
            loading={saving}
            onPress={handleUpdate}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 112,
  },

  formCard: {
    margin: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },

  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.foreground,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  flex: {
    flex: 1,
  },
});

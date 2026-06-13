import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import api from '../../services/api';
import { pickAndUploadImage, takeAndUploadPhoto } from '../../services/upload';
import { colors, fonts, radius, spacing } from '../../constants/theme';

import { ImagePickerField } from '../../components/create-unit/ImagePickerField';
import { FormInput } from '../../components/create-unit/FormInput';
import { CoordinateFields } from '../../components/create-unit/CoordinateFields';
import { StatusSelector } from '../../components/create-unit/StatusSelector';
import { SubmitButton } from '../../components/create-unit/SubmitButton';
import { showError, showSuccess, showWarning } from '../../components/ui/FeedbackProvider';

type CreateUnitForm = {
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

const initialForm: CreateUnitForm = {
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

export default function CreateUnit() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState<CreateUnitForm>(initialForm);

  function updateField(key: keyof CreateUnitForm, value: string) {
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

  async function useMyLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      showWarning('Permissão negada', 'Ative a localização nas configurações para usar sua posição atual.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    updateField('lat', String(location.coords.latitude));
    updateField('lng', String(location.coords.longitude));

    showSuccess('Localização adicionada', 'As coordenadas foram preenchidas com sua posição atual.');
  }

  function validateForm() {
    if (
      !form.name ||
      !form.CNPJ ||
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

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const lat = parseFloat(form.lat);
      const lng = parseFloat(form.lng);
      const capacity = parseInt(form.capacity, 10);
      const currentOccupancy = parseInt(form.currentOccupancy, 10);

      if (
        Number.isNaN(lat) ||
        Number.isNaN(lng) ||
        Number.isNaN(capacity) ||
        Number.isNaN(currentOccupancy)
      ) {
        showWarning('Dados inválidos', 'Capacidade, ocupação atual e coordenadas precisam ser números válidos.');
        return;
      }

      if (capacity < 1 || currentOccupancy < 0) {
        showWarning('Capacidade inválida', 'Capacidade deve ser maior que zero e ocupação atual não pode ser negativa.');
        return;
      }

      if (currentOccupancy > capacity) {
        showWarning('Ocupação inválida', 'A ocupação atual não pode ser maior que a capacidade.');
        return;
      }

      await api.post('/support-units', {
        name: form.name,
        CNPJ: form.CNPJ,
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

      showSuccess(
        'Unidade criada',
        'Sua unidade foi enviada e ficará disponível após validação.',
        () => router.back(),
      );
    } catch {
      showError('Não foi possível criar a unidade', 'Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.sectionTitle}>Dados básicos</Text>

          <FormInput
            label="Nome da Instituição *"
            placeholder="Digite o nome"
            value={form.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <FormInput
            label="Descrição"
            placeholder="Faça uma descrição"
            value={form.description}
            multiline
            onChangeText={(value) => updateField('description', value)}
          />
          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Contato</Text>

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

            <View style={styles.flex}>
              <FormInput
                label="CNPJ *"
                placeholder="00.000.000/0001-00"
                value={form.CNPJ}
                onChangeText={(value) => updateField('CNPJ', value)}
              />
            </View>
          </View>
          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Localização</Text>
          <CoordinateFields
            latitude={form.lat}
            longitude={form.lng}
            onChangeLatitude={(value) => updateField('lat', value)}
            onChangeLongitude={(value) => updateField('lng', value)}
            onUseCurrentLocation={useMyLocation}
          />

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Capacidade e serviços</Text>
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
        </View>

        <View style={styles.submitSection}>
          <SubmitButton
            title="Criar Unidade"
            loading={loading}
            onPress={handleSubmit}
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
    paddingBottom: 124,
  },

  formCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },

  submitSection: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },

  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  flex: {
    flex: 1,
  },
});

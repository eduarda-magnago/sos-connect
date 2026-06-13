import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import api from '../../../services/api';
import { pickAndUploadImage, takeAndUploadPhoto } from '../../../services/upload';
import { colors, spacing } from '../../../constants/theme';

import { LoadingState } from '../../../components/ui/LoadingState';
import { ImagePickerField } from '../../../components/create-unit/ImagePickerField';
import { FormInput } from '../../../components/create-unit/FormInput';
import { CoordinateFields } from '../../../components/create-unit/CoordinateFields';
import { StatusSelector } from '../../../components/create-unit/StatusSelector';
import { SubmitButton } from '../../../components/create-unit/SubmitButton';

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
      Alert.alert('Erro', 'Não foi possível carregar os dados da unidade.');
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
      Alert.alert('Erro', error.message || 'Nao foi possivel enviar a imagem.');
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
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
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
    Alert.alert('Atenção', 'Latitude e longitude precisam ser válidas.');
    setSaving(false);
    return;
  }

  if (Number.isNaN(capacity) || Number.isNaN(currentOccupancy)) {
    Alert.alert('Atencao', 'Capacidade e ocupacao atual precisam ser numeros validos.');
    setSaving(false);
    return;
  }

  if (capacity < 1 || currentOccupancy < 0) {
    Alert.alert('Atencao', 'Capacidade deve ser maior que zero e ocupacao atual nao pode ser negativa.');
    setSaving(false);
    return;
  }

  if (currentOccupancy > capacity) {
    Alert.alert('Atencao', 'A ocupacao atual nao pode ser maior que a capacidade.');
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

    Alert.alert('✓ Sucesso', 'Unidade atualizada com sucesso.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  } catch (error: any) {
    console.error('Erro ao atualizar unidade:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

   Alert.alert('Erro', 'Não foi possível salvar os dados.', [
  { text: 'OK' },
]);

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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImagePickerField
          image={image}
          onPress={showImageOptions}
          loading={imageLoading}
        />

        <View style={styles.form}>
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
              Alert.alert(
                'Localização',
                'Podemos reaproveitar aqui a função de localização depois.'
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
            label="Servicos disponiveis"
            placeholder="Ex: alimentacao, abrigo, agua"
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
            label="Ocupacao atual *"
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

          <View style={styles.bottomSpace} />
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

  form: {
    padding: spacing.md,
    gap: spacing.md,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  flex: {
    flex: 1,
  },

  bottomSpace: {
    height: 32,
  },
});

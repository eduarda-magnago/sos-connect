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
import { colors, spacing } from '../../../constants/theme';

import { LoadingState } from '../../../components/ui/LoadingState';
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
  status: string;
  capacity: string;
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
};

const initialForm: EditUnitForm = {
  name: '',
  email: '',
  phone: '',
  CNPJ: '',
  description: '',
  status: 'open',
  capacity: '',
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUnit();
  }, [unitId]);

  function updateField(key: keyof EditUnitForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function loadUnit() {
    try {
      const response = await api.get(`/support-units/${unitId}`);
      const unit: SupportUnitResponse = response.data;

      const coordinates = unit.location?.coordinates;

      setForm({
        name: unit.name || '',
        email: unit.contact?.email || '',
        phone: unit.contact?.phone || '',
        CNPJ: unit.CNPJ || '',
        description: unit.description || '',
        status: unit.status || 'open',
        capacity: unit.capacity ? String(unit.capacity) : '',
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

  function validateForm() {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.capacity ||
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

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    Alert.alert('Atenção', 'Latitude e longitude precisam ser válidas.');
    setSaving(false);
    return;
  }

  if (Number.isNaN(capacity)) {
    Alert.alert('Atenção', 'Capacidade precisa ser um número válido.');
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
      status: form.status,
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
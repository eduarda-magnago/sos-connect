import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

import api from '../../services/api';
import { pickAndUploadImage, takeAndUploadPhoto } from '../../services/upload';
import { colors, spacing } from '../../constants/theme';

import { ImagePickerField } from '../../components/create-unit/ImagePickerField';
import { FormInput } from '../../components/create-unit/FormInput';
import { CoordinateFields } from '../../components/create-unit/CoordinateFields';
import { StatusSelector } from '../../components/create-unit/StatusSelector';
import { SubmitButton } from '../../components/create-unit/SubmitButton';

type CreateUnitForm = {
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

const initialForm: CreateUnitForm = {
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

  async function useMyLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Ative a localização nas configurações.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    updateField('lat', String(location.coords.latitude));
    updateField('lng', String(location.coords.longitude));

    Alert.alert('✓', 'Localização obtida com sucesso!');
  }

  function validateForm() {
    if (
      !form.name ||
      !form.CNPJ ||
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

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/support-units', {
        name: form.name,
        CNPJ: form.CNPJ,
        description: form.description,
        contact: {
          email: form.email,
          phone: form.phone,
        },
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        },
        capacity: parseInt(form.capacity, 10),
        status: form.status,
        image_url: image,
      });

      Alert.alert('✓ Sucesso', 'Unidade criada! Aguarde a validação do admin.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a unidade. Verifique os dados.');
    } finally {
      setLoading(false);
    }
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
            onUseCurrentLocation={useMyLocation}
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

            <View style={styles.flex}>
              <FormInput
                label="CNPJ *"
                placeholder="00.000.000/0001-00"
                value={form.CNPJ}
                onChangeText={(value) => updateField('CNPJ', value)}
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
            title="Criar Unidade"
            loading={loading}
            onPress={handleSubmit}
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

import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

import api from './api';

type UploadSource = 'camera' | 'gallery';
type UploadOptions = {
  aspect?: [number, number];
};

async function requestPermission(source: UploadSource) {
  const permission =
    source === 'gallery'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error(
      source === 'gallery'
        ? 'Permissao de galeria negada.'
        : 'Permissao de camera negada.',
    );
  }
}

async function launchPicker(source: UploadSource, options?: UploadOptions) {
  const pickerOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: options?.aspect || [16, 9],
    quality: 0.7,
  };

  return source === 'gallery'
    ? ImagePicker.launchImageLibraryAsync(pickerOptions)
    : ImagePicker.launchCameraAsync(pickerOptions);
}

async function pickAndUpload(
  source: UploadSource,
  folder: string,
  options?: UploadOptions,
) {
  await requestPermission(source);

  const result = await launchPicker(source, options);
  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  const mimeType = asset.mimeType || 'image/jpeg';
  const base64 = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: 'base64',
  });

  const response = await api.post<{ url: string }>(
    '/upload/image',
    {
      base64: `data:${mimeType};base64,${base64}`,
      folder,
    },
    {
      timeout: 60000,
    },
  );

  return response.data.url;
}

export function pickAndUploadImage(folder: string, options?: UploadOptions) {
  return pickAndUpload('gallery', folder, options);
}

export function takeAndUploadPhoto(folder: string, options?: UploadOptions) {
  return pickAndUpload('camera', folder, options);
}

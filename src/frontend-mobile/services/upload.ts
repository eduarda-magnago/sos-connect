import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import api from './api';

type UploadSource = 'camera' | 'gallery';

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

async function launchPicker(source: UploadSource) {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.7,
  };

  return source === 'gallery'
    ? ImagePicker.launchImageLibraryAsync(options)
    : ImagePicker.launchCameraAsync(options);
}

async function pickAndUpload(source: UploadSource, folder: string) {
  await requestPermission(source);

  const result = await launchPicker(source);
  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  const mimeType = asset.mimeType || 'image/jpeg';
  const base64 = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: 'base64',
  });

  const response = await api.post<{ url: string }>('/upload/image', {
    base64: `data:${mimeType};base64,${base64}`,
    folder,
  }, {
    timeout: 30000,
  });

  return response.data.url;
}

export function pickAndUploadImage(folder: string) {
  return pickAndUpload('gallery', folder);
}

export function takeAndUploadPhoto(folder: string) {
  return pickAndUpload('camera', folder);
}

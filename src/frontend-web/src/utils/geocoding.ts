import { useState, useEffect } from 'react';
import api from '../services/api';

const geocodeCache = new Map<string, string>();

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;

  try {
    const { data } = await api.get(`/geocoding/reverse?lat=${lat}&lng=${lng}`);
    geocodeCache.set(key, data.address);
    return data.address;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export function useReverseGeocode(lat: number, lng: number) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;

    let mounted = true;

    reverseGeocode(lat, lng).then(result => {
      if (mounted) {
        setAddress(result);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [lat, lng]);

  return { address, loading };
}
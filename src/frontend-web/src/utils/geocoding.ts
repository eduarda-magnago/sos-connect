/**
 * Utilitários para geocodificação
 */

/**
 * Converte coordenadas em endereço usando Nominatim (OpenStreetMap)
 * @param lat Latitude
 * @param lng Longitude
 * @returns Promise<string> Endereço formatado ou erro
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`,
      {
        headers: {
          'User-Agent': 'SOS-Connect/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Falha na geocodificação');
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Extrair endereço relevante
    const address = data.address;
    const parts = [];

    if (address.road) parts.push(address.road);
    if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood);
    if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
    if (address.state) parts.push(address.state);

    return parts.length > 0 ? parts.join(', ') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/**
 * Hook personalizado para geocodificação reversa com cache
 */
import { useState, useEffect } from 'react';

export function useReverseGeocode(lat: number, lng: number) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAddress = async () => {
      setLoading(true);
      const result = await reverseGeocode(lat, lng);
      if (mounted) {
        setAddress(result);
        setLoading(false);
      }
    };

    fetchAddress();

    return () => {
      mounted = false;
    };
  }, [lat, lng]);

  return { address, loading };
}
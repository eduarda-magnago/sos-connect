import { Injectable } from '@nestjs/common'

@Injectable()
export class GeocodingService {
  async reverseGeocode(lat: number, lng: number): Promise<{ address: string }> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`,
      { headers: { 'User-Agent': 'SOS-Connect/1.0' } }
    )

    if (!response.ok) throw new Error('Falha na geocodificação')

    const data = await response.json()
    if (data.error) throw new Error(data.error)

    const addr = data.address
    const parts: string[] = []
    if (addr.road) parts.push(addr.road)
    if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
    if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village)
    if (addr.state) parts.push(addr.state)

    const address = parts.length > 0 ? parts.join(', ') : `${lat}, ${lng}`
    return { address }
  }
}
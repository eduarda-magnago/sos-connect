import { toast } from 'react-toastify'

interface LocationFieldProps {
  lat: string
  lng: string
  onLocationChange: (lat: string, lng: string) => void
}

export default function LocationField({ lat, lng, onLocationChange }: LocationFieldProps) {
  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(
          String(pos.coords.latitude),
          String(pos.coords.longitude),
        )
        toast.success('Localização obtida com sucesso!')
      },
      () => toast.error('Não foi possível obter sua localização'),
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs" style={{ color: 'var(--color-muted)' }}>Coordenadas</label>
        <button
          type="button"
          onClick={useMyLocation}
          className="text-xs hover:underline"
          style={{ color: 'var(--color-action)' }}
        >
          Usar minha localização
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Latitude"
          value={lat}
          onChange={(e) => onLocationChange(e.target.value, lng)}
          required
          className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          style={{ border: '1px solid var(--color-border)' }}
        />
        <input
          placeholder="Longitude"
          value={lng}
          onChange={(e) => onLocationChange(lat, e.target.value)}
          required
          className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          style={{ border: '1px solid var(--color-border)' }}
        />
      </div>
    </div>
  )
}
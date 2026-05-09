import { useState, useEffect } from 'react'
import api from '../../services/api'
import Map from '../../components/Map'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'open', label: 'Disponível' },
  { value: 'full', label: 'Cheia' },
  { value: 'closed', label: 'Fechada' },
]

const DEFAULT_RADIUS_KM = 20

const FALLBACK_LOCATION = { lat: -23.5505, lng: -46.6333 } // São Paulo

interface SupportUnit {
  _id: string
  name: string
  status: string
  capacity: number
  current_occupancy: number
  services_available: string[]
  contact: { email: string; phone: string }
  location: { coordinates: number[] }
}

export default function Home() {

  const [units, setUnits] = useState<SupportUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [statusFilter, setStatusFilter] = useState('')
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM)
  const [appliedStatus, setAppliedStatus] = useState('')
  const [appliedRadiusKm, setAppliedRadiusKm] = useState(DEFAULT_RADIUS_KM)

  //  Pega localização do usuário
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(FALLBACK_LOCATION)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Erro ao obter localização, usando fallback (São Paulo):', error)
        setLocation(FALLBACK_LOCATION)
      }
    )
  }, [])

  //  Carregar unidades quando tiver localização ou filtros aplicados
  useEffect(() => {
    if (location) {
      loadUnits()
    }
  }, [location, appliedStatus, appliedRadiusKm])

  //  Função de requisição
  async function loadUnits() {
    if (!location) return

    try {
      const params = new URLSearchParams()

      params.append('lat', String(location.lat))
      params.append('lng', String(location.lng))
      params.append('radius', String(appliedRadiusKm * 1000))
      if (appliedStatus) params.append('status', appliedStatus)

      const response = await api.get(`/support-units?${params.toString()}`)
      setUnits(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    setAppliedStatus(statusFilter)
    setAppliedRadiusKm(radiusKm)
  }

  function handleClear() {
    setStatusFilter('')
    setRadiusKm(DEFAULT_RADIUS_KM)
    setAppliedStatus('')
    setAppliedRadiusKm(DEFAULT_RADIUS_KM)
  }

  return (
    <>
      <h1 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-foreground)' }}>
         Encontre ajuda perto de você!
       </h1>
       
      {/* Mapa */}
      <div
  className="w-full max-w-5xl mx-auto px-4 rounded-2xl overflow-hidden mb-6 shadow-sm"
  style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)' }}
>
        <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
            Mapa de Unidades de Apoio
          </h2>
        </div>

        <div className="h-[300px] md:h-[400px] lg:h-[320px]">
          {loading || !location ? (
            <div className="h-full flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                Obtendo localização...
              </p>
            </div>
          ) : (
            <Map units={units} radius={appliedRadiusKm * 1000} userLocation={location!} />
          )}
        </div>
      </div>

      {/* Filtros */}
      <div
        className="w-full max-w-5xl mx-auto px-6 py-5 rounded-2xl shadow-sm"
        style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-foreground)' }}>
            Filtros
          </h2>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Limpar filtro
          </button>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-8">
          <div className="flex-1">
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              Status da unidade
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 rounded-full border border-gray-200 bg-white px-4 text-xs text-gray-700 outline-none focus:border-[#102946]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-xs font-medium"
                style={{ color: 'var(--color-foreground)' }}
              >
                Raio de Distância
              </label>
              <span className="text-xs text-gray-600">{radiusKm}km</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-[#102946]"
            />
          </div>

          <div className="md:self-end">
            <button
              type="button"
              onClick={handleApply}
              className="h-10 rounded-md bg-[#102946] px-8 text-xs font-semibold text-white hover:bg-[#0b1f36] transition-colors cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
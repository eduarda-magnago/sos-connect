import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import Map from '../../components/Map'

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
  const { user } = useAuth()

  const [units, setUnits] = useState<SupportUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  //  Pega localização do usuário
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        setLoading(false)
      }
    )
  }, [])

  //  Carregar unidades quando tiver localização
  useEffect(() => {
    if (location) {
      loadUnits()
    }
  }, [location])

  //  Função de requisição
  async function loadUnits() {
    if (!location) return

    try {
      const params = new URLSearchParams()

      params.append('lat', String(location.lat))
      params.append('lng', String(location.lng))

      const response = await api.get(`/support-units?${params.toString()}`)
      setUnits(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
            <Map units={units} radius={10000} userLocation={location!} />
          )}
        </div>
      </div>

      {/* Espaço reservado para filtros — implementar aqui no futuro */}
    </>
  )
}
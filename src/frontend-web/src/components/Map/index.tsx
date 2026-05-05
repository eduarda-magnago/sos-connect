import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { useEffect } from 'react'

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

interface MapProps {
  units: SupportUnit[]
  radius?: number
  userLocation: { lat: number; lng: number }
}

const statusColor: Record<string, string> = {
  open:   '#22C55E',
  full:   '#F59E0B',
  closed: '#EF4444',
}

const statusLabel: Record<string, string> = {
  open:   'Disponível',
  full:   'Lotado',
  closed: 'Fechado',
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [center, map])

  return null
}

export default function Map({ units, radius = 10000, userLocation }: MapProps) {
  const center: [number, number] = [userLocation.lat, userLocation.lng]

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <Recenter center={center} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Circle
        center={center}
        radius={radius}
        pathOptions={{ color: '#1a2744', fillColor: '#1a2744', fillOpacity: 0.05 }}
      />

      <Marker position={center}>
        <Popup>Você está aqui</Popup>
      </Marker>

      {units.map((unit) => {
        const [lng, lat] = unit.location.coordinates
        return (
          <Marker key={unit._id} position={[lat, lng]}>

            {/* Implementar MODAL da visualização de unidades de apoio pois isso é apenas um EXEMPLO */}
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{unit.name}</p>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: statusColor[unit.status] }}
                  >
                    {statusLabel[unit.status]}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p> Vagas: {unit.capacity - unit.current_occupancy}/{unit.capacity}</p>
                  <p> Telefone:  {unit.contact?.phone}</p>
                  <p> Email: {unit.contact?.email}</p>
                  {unit.services_available?.length > 0 && (
                    <p>Serviços: {unit.services_available.join(', ')}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
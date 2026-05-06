import { useEffect, useRef } from 'react'
import { X, ShareNetwork } from 'phosphor-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useReverseGeocode } from '../../utils/geocoding'
import StatusBadge from '../StatusBadge/index'

interface SupportUnit {
  _id: string
  name: string
  status: string
  description?: string
  contact: { email: string; phone: string }
  location: { coordinates: number[] }
  capacity: number
  current_occupancy: number
  services_available: string[]
}

interface UnitModalProps {
  unit: SupportUnit | null
  onClose: () => void
}

export default function UnitModal({ unit, onClose }: UnitModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const { address, loading: addressLoading } = useReverseGeocode(
    unit?.location?.coordinates[1] || 0,
    unit?.location?.coordinates[0] || 0
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!unit) return null

  const lat = unit.location?.coordinates[1] || 0
  const lng = unit.location?.coordinates[0] || 0
  const capacidadeRestante = unit.capacity - unit.current_occupancy

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado!')
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative font-['Roboto']">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-[#000000]">{unit.name}</h2>
          <StatusBadge status={unit.status} />
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <img src="/icons/location.png" alt="Endereço" className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Endereço: {addressLoading ? 'carregando...' : address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <img src="/icons/capacity.png" alt="Capacidade" className="w-4 h-4 shrink-0" />
              <span>Capacidade restante: {capacidadeRestante}</span>
            </div>
          </div>

          <div className="w-60 h-36 rounded-lg overflow-hidden shrink-0 z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={true}
                dragging={true}
                zoomControl={true}
                attributionControl={false}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} />
            </MapContainer>
            </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#000000] mb-1">Descrição</h3>
          <p className="text-xs text-gray-500">
            {unit.description || 'Sem descrição disponível.'}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#000000] mb-1">Contato</h3>
          <p className="text-xs text-gray-500">E-mail: {unit.contact?.email}</p>
          <p className="text-xs text-gray-500">Telefone: {unit.contact?.phone}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-[#000000] hover:text-gray-600 cursor-pointer transition-colors"
          >
            Compartilhar
            <ShareNetwork size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
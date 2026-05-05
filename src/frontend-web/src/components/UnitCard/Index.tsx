import { useNavigate } from 'react-router-dom'
import { PencilSimple } from 'phosphor-react'
import StatusBadge from '../StatusBadge/index'
import { useReverseGeocode } from '../../utils/geocoding'

interface SupportUnit {
  _id: string
  name: string
  status: string
  validated: boolean
  capacity: number
  current_occupancy: number
  location: { coordinates: number[] }
  services_available: string[]
  support_unit_user_id: string
}

interface UnitCardProps {
  unit: SupportUnit
  isOwner?: boolean
}

export default function UnitCard({ unit, isOwner = false }: UnitCardProps) {
  const navigate = useNavigate()
  const { address, loading: addressLoading } = useReverseGeocode(
    unit.location?.coordinates[1] || 0,
    unit.location?.coordinates[0] || 0
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold text-gray-900 ${isOwner ? '' : 'text-sm'}`}>{unit.name}</h3>
        <StatusBadge status={unit.status} />
      </div>

      <div className="text-xs text-gray-400 space-y-1 mb-4">
        <p>📍 {addressLoading ? 'Carregando endereço...' : address}</p>
        <p>👥 Capacidade restante: {unit.capacity - unit.current_occupancy}</p>
      </div>

      {isOwner ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/support-units/${unit._id}/donations`)}
            className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Doação
          </button>
          <button
            onClick={() => navigate(`/support-units/${unit._id}/missions`)}
            className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Missão
          </button>
          <button
            onClick={() => navigate(`/support-units/${unit._id}/edit`)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <PencilSimple size={18} color='gray' />
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate(`/support-units/${unit._id}`)}
          className="mx-auto text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Visualizar
        </button>
      )}
    </div>
  )
}
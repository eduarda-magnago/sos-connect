import { useNavigate } from 'react-router-dom'
import { PencilSimple, CheckCircle, Trash } from 'phosphor-react'
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
  role: string
  isOwner?: boolean
}

export default function UnitCard({ unit, role, isOwner = false }: UnitCardProps) {
  const navigate = useNavigate()
  const { address, loading: addressLoading } = useReverseGeocode(
    unit.location?.coordinates[1] || 0,
    unit.location?.coordinates[0] || 0
  )

  const renderButtons = () => {
    if (role === 'volunteer') {
      return (
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
        </div>
      )
    } else if (role === 'victim') {
      return (
        <button
          onClick={() => navigate(`/support-units/${unit._id}`)}
          className="mx-auto text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Visualizar
        </button>
      )
    } else if (role === 'support_unit' && isOwner) {
      return (
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
      )
    } else if (role === 'support_unit' && !isOwner) {
      return (
        <button
          onClick={() => navigate(`/support-units/${unit._id}`)}
          className="mx-auto text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Visualizar
        </button>
      )
    } else if (role === 'admin') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/support-units/${unit._id}`)}
            className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Visualizar
          </button>
          {!unit.validated && (
            <button
              onClick={() => {/* approve logic */}}
              className="text-xs border border-green-200 text-green-600 rounded-lg px-4 py-1.5 hover:bg-green-50 transition-colors"
            >
              <CheckCircle size={16} />
              Aprovar
            </button>
          )}
          <button
            onClick={() => {/* delete logic */}}
            className="text-xs border border-red-200 text-red-600 rounded-lg px-4 py-1.5 hover:bg-red-50 transition-colors"
          >
          
            Excluir
          </button>
        </div>
      )
    }
    return null
  }

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

      {renderButtons()}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../services/api'
import { useReverseGeocode } from '../../../utils/geocoding'

interface Mission {
  _id: string
  title: string
  description: string
  category: string
  volunteers_needed: number
  volunteer_ids?: string[]
  date: string
}

interface SupportUnit {
  _id: string
  name: string
  location: { coordinates: number[] }
}

export default function Missions() {
  const { id } = useParams()
  const [unit, setUnit] = useState<SupportUnit | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  const { address, loading: addressLoading } = useReverseGeocode(
    unit?.location?.coordinates[1] || 0,
    unit?.location?.coordinates[0] || 0
  )

  useEffect(() => {
    async function load() {
      try {
        const [unitRes, missionsRes] = await Promise.all([
          api.get(`/support-units/${id}`),
          api.get(`/missions?support_unit_id=${id}`)
        ])
        setUnit(unitRes.data)
        setMissions(missionsRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <h2 className="text-sm font-semibold text-gray-900 mb-4">Missões de Ajuda</h2>

        {unit && (
          <div className="border border-gray-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm font-medium text-gray-900">{unit.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <img src="/icons/location.png" alt="Endereço" className="w-3.5 h-3.5 shrink-0" />
              <p className="text-xs text-gray-500">
                {addressLoading ? 'Carregando...' : address}
              </p>
            </div>
          </div>
        )}

        {missions.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            Nenhuma missão disponível.
          </p>
        ) : (
          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission._id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-800">{mission.title}</span>
                  <span className="text-xs text-gray-400">{mission.category} · {new Date(mission.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <button className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  Participar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
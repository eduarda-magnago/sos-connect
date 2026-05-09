import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../services/api'
import { useReverseGeocode } from '../../../utils/geocoding'
import { useAuth } from '../../../contexts/AuthContext'
import CreateMissionModal, {
  type MissionFormData,
} from '../components/CreateMissionModal'

interface Mission {
  _id: string
  title: string
  description: string
  category: string
  volunteers_needed: number
  volunteer_ids?: string[]
  date: string
  contact_phone?: string
  delivery_time?: string
}

interface SupportUnit {
  _id: string
  name: string
  location: { coordinates: number[] }
  support_unit_user_id: string
}

export default function Missions() {
  const { id } = useParams()
  const { user } = useAuth()
  const [unit, setUnit] = useState<SupportUnit | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingMission, setEditingMission] = useState<Mission | null>(null)

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

  const isOwner = !!(user && unit && user._id === unit.support_unit_user_id)

  async function handleCreate(data: MissionFormData) {
    const res = await api.post('/missions', { ...data, support_unit_id: id })
    setMissions((prev) => [...prev, res.data])
    setIsCreateOpen(false)
  }

  async function handleEdit(data: MissionFormData) {
    if (!editingMission) return
    const res = await api.put(`/missions/${editingMission._id}`, data)
    setMissions((prev) =>
      prev.map((m) => (m._id === editingMission._id ? res.data : m))
    )
    setEditingMission(null)
  }

  async function handleDelete(missionId: string) {
    if (!window.confirm('Tem certeza que deseja excluir esta missão?')) return
    try {
      await api.delete(`/missions/${missionId}`)
      setMissions((prev) => prev.filter((m) => m._id !== missionId))
    } catch (err) {
      console.error(err)
    }
  }

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

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Missões de Ajuda</h2>
          {isOwner && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs bg-[#102946] text-white rounded-lg px-4 py-1.5 hover:bg-[#0b1f36] transition-colors cursor-pointer"
            >
              Criar missão
            </button>
          )}
        </div>

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
                <div className="flex items-center gap-2">
                  {isOwner && (
                    <>
                      <button
                        onClick={() => setEditingMission(mission)}
                        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(mission._id)}
                        className="text-xs border border-red-200 text-red-600 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateMissionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <CreateMissionModal
        mode="edit"
        isOpen={!!editingMission}
        onClose={() => setEditingMission(null)}
        onSubmit={handleEdit}
        initialValues={editingMission ?? undefined}
      />
    </div>
  )
}
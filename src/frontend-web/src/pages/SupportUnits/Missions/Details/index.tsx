import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../../services/api'
import { useReverseGeocode } from '../../../../utils/geocoding'
import ApplicationModal from '../../components/ApplicationModal'
import SuccessModal from '../../components/SuccessModal'
import { useAuth } from '../../../../contexts/AuthContext'

interface Mission {
  _id: string
  title: string
  description: string
  category: string
  status: string
  volunteers_needed: number
  volunteer_ids: string[]
  date: string
}

interface SupportUnit {
  _id: string
  name: string
  capacity: number
  current_occupancy: number
  location: { coordinates: number[] }
}

const categoryLabel: Record<string, string> = {
  cozinha: 'Cozinha',
  limpeza: 'Limpeza',
  medico: 'Médico',
  transporte: 'Transporte',
  cuidado_infantil: 'Cuidado Infantil',
  construcao: 'Construção',
  distribuicao: 'Distribuição',
  outro: 'Outro',
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
}

export default function MissionDetail() {
  const { id, missionId } = useParams()
  const [unit, setUnit] = useState<SupportUnit | null>(null)
  const [mission, setMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const { user } = useAuth()

  const { address, loading: addressLoading } = useReverseGeocode(
    unit?.location?.coordinates[1] || 0,
    unit?.location?.coordinates[0] || 0
  )

  useEffect(() => {
    async function load() {
      try {
        const [unitRes, missionRes] = await Promise.all([
          api.get(`/support-units/${id}`),
          api.get(`/missions/${missionId}`)
        ])
        setUnit(unitRes.data)
        setMission(missionRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, missionId])

  useEffect(() => {
  async function checkIfAlreadyApplied() {
    if (!user?._id || !missionId) return

    try {
      const res = await api.get('/mission-volunteers')

      const exists = res.data.some((application: any) => {
        const applicationUserId =
          typeof application.user_id === 'string'
            ? application.user_id
            : application.user_id?._id

        const applicationMissionId =
          typeof application.mission_id === 'string'
            ? application.mission_id
            : application.mission_id?._id

        return applicationUserId === user._id && applicationMissionId === missionId
      })

      setAlreadyApplied(exists)
    } catch (err) {
      console.error(err)
    }
  }

  checkIfAlreadyApplied()
}, [user, missionId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (!mission || !unit) return null

  const capacidadeRestante = unit.capacity - unit.current_occupancy
  const vagasRestantes = mission.volunteers_needed - mission.volunteer_ids.length

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

        <h2 className="text-sm font-semibold text-gray-900">Missões de Ajuda</h2>

        <div className="border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-gray-900">{mission.title}</p>
        </div>

        <div className="border border-gray-100 rounded-xl px-4 py-3 space-y-1">
          <p className="text-sm font-medium text-gray-900">{unit.name}</p>
          <div className="flex items-center gap-1">
            <img src="/icons/location.png" alt="Endereço" className="w-3.5 h-3.5 shrink-0" />
            <p className="text-xs text-gray-500">{addressLoading ? 'Carregando...' : address}</p>
          </div>
          <div className="flex items-center gap-1">
            <img src="/icons/capacity.png" alt="Capacidade" className="w-3.5 h-3.5 shrink-0" />
            <p className="text-xs text-gray-500">Capacidade restante: {capacidadeRestante}</p>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-gray-900">Informações da missão:</p>
          <p className="text-xs text-gray-500">Categoria: <span className="text-gray-700">{categoryLabel[mission.category] ?? mission.category}</span></p>
          <p className="text-xs text-gray-500">Status: <span className="text-gray-700">{statusLabel[mission.status] ?? mission.status}</span></p>
          <p className="text-xs text-gray-500">Data: <span className="text-gray-700">{new Date(mission.date).toLocaleDateString('pt-BR')}</span></p>
          <p className="text-xs text-gray-500">Vagas restantes: <span className="text-gray-700">{vagasRestantes}</span></p>
          <p className="text-xs text-gray-500">Descrição: <span className="text-gray-700">{mission.description}</span></p>

          <div className="pt-2 flex justify-end">
              <button
                disabled={alreadyApplied}
                onClick={() => setIsModalOpen(true)}
                className={`text-xs rounded-lg px-4 py-1.5 transition-colors
                  ${
                    alreadyApplied
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'border border-gray-200 hover:bg-gray-50 cursor-pointer'
                  }`}
              >
                {alreadyApplied
                  ? 'Candidatura enviada'
                  : 'Candidatar-se para missão'}
              </button>
              <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={async () => {
                  await api.post('/mission-volunteers', {
                    mission_id: missionId,
                  })

                  setAlreadyApplied(true)

                  setIsModalOpen(false)
                  setIsSuccessOpen(true)
                }}
              />

              <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
              />
          </div>
        </div>

      </div>
      
    </div>
  )
}
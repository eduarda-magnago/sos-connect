import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface SupportUnit {
  _id: string
  name: string
  address?: string
  support_unit_user_id: string
}

interface Application {
  _id: string
  status: string
  mission_id: {
    _id: string
    title: string
    description?: string
    date?: string
    volunteer_ids?: string[]
    support_unit_id: string | { _id: string }
  }
  user_id: {
    _id: string
    name: string
    email: string
  }
}

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
  completed: 'Concluída',
  withdrawn: 'Cancelada',
}

export default function CandidaturesInstitution() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [unitsById, setUnitsById] = useState<Record<string, SupportUnit>>({})
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadApplications()
  }, [user?._id, user?.role])

  async function loadApplications() {
    if (!user?._id) return

    try {
      setLoading(true)

      const [unitsResponse, applicationsResponse] = await Promise.all([
        api.get('/support-units'),
        api.get('/mission-volunteers'),
      ])

      const myUnits = unitsResponse.data.filter((unit: SupportUnit) => {
        return user.role === 'admin' || unit.support_unit_user_id === user._id
      })

      const myUnitIds = myUnits.map((unit: SupportUnit) => unit._id)

      const unitMap = myUnits.reduce(
        (acc: Record<string, SupportUnit>, unit: SupportUnit) => {
          acc[unit._id] = unit
          return acc
        },
        {}
      )

      const myApplications = applicationsResponse.data.filter(
        (application: Application) => {
          const supportUnitId =
            typeof application.mission_id?.support_unit_id === 'string'
              ? application.mission_id.support_unit_id
              : application.mission_id?.support_unit_id?._id

          return myUnitIds.includes(supportUnitId)
        }
      )

      setUnitsById(unitMap)
      setApplications(myApplications)
    } catch (err) {
      console.error(err)
      alert('Não foi possível carregar as candidaturas.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmParticipation(application: Application) {
    try {
      setProcessingId(application._id)

      await api.patch(`/mission-volunteers/${application._id}`, {
        status: 'approved',
      })

      const volunteerIds = Array.from(
        new Set([
          ...(application.mission_id.volunteer_ids ?? []),
          application.user_id._id,
        ])
      )

      await api.put(`/missions/${application.mission_id._id}`, {
        volunteer_ids: volunteerIds,
      })

      setApplications((prev) =>
        prev.map((item) =>
          item._id === application._id
            ? {
                ...item,
                status: 'approved',
                mission_id: {
                  ...item.mission_id,
                  volunteer_ids: volunteerIds,
                },
              }
            : item
        )
      )
    } catch (err) {
      console.error(err)
      alert('Não foi possível confirmar a participação.')
    } finally {
      setProcessingId(null)
    }
  }

  function getSupportUnit(application: Application) {
    const supportUnitId =
      typeof application.mission_id?.support_unit_id === 'string'
        ? application.mission_id.support_unit_id
        : application.mission_id?.support_unit_id?._id

    return unitsById[supportUnitId]
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
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Candidaturas
        </h2>

        {applications.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            Nenhuma candidatura encontrada.
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => {
              const unit = getSupportUnit(application)
              const isApproved = application.status === 'approved'
              const isProcessing = processingId === application._id

              return (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-xl px-6 py-4 space-y-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {unit?.name ?? 'Unidade de apoio'}
                    </p>

                    {unit?.address && (
                      <p className="text-xs text-gray-500 mt-1">
                        {unit.address}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-700">
                    <strong>Missão:</strong> {application.mission_id?.title}
                  </p>

                  <p className="text-xs text-gray-700">
                    <strong>Candidato:</strong> {application.user_id?.name}
                  </p>

                  <p className="text-xs text-gray-700">
                    <strong>Email:</strong> {application.user_id?.email}
                  </p>

                  <p className="text-xs text-gray-700">
                    <strong>Status:</strong>{' '}
                    {statusLabel[application.status] ?? application.status}
                  </p>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => handleConfirmParticipation(application)}
                      disabled={isApproved || isProcessing}
                      className={`text-xs rounded-lg px-4 py-2 transition-all font-medium ${
                        isApproved || isProcessing
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#1a2e44] text-white hover:bg-slate-800 cursor-pointer'
                      }`}
                    >
                      {isProcessing
                        ? 'Confirmando...'
                        : isApproved
                          ? 'Participação confirmada'
                          : 'Confirmar participação'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
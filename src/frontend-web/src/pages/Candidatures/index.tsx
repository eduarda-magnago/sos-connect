import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface Application {
  _id: string
  status: string
  mission_id: {
    _id: string
    title: string
    description: string
    date: string
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

export default function Candidatures() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      if (!user?._id) return

      try {
        const res = await api.get('/mission-volunteers')

        const userApplications = res.data.filter((application: Application) => {
          return application.user_id?._id === user._id
        })

        setApplications(userApplications)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [user])

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
            {applications.map((application) => (
              <div
                key={application._id}
                className="border border-gray-200 rounded-md px-6 py-4 space-y-3"
              >
                <p className="text-sm font-medium text-gray-900">
                  Abrigo Esperança
                </p>

                <p className="text-xs text-gray-700">
                  📍 Rua Santa Teresa, Glicério, São Paulo, São Paulo
                </p>

                <p className="text-xs text-gray-700">
                  <strong>Missão:</strong> {application.mission_id?.title}
                </p>

                <p className="text-xs text-gray-700">
                  <strong>Data:</strong>{' '}
                  {new Date(application.mission_id.date).toLocaleDateString(
                    'pt-BR'
                  )}
                </p>

                <p className="text-xs text-gray-700">
                  <strong>Status:</strong>{' '}
                  {statusLabel[application.status] ?? application.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
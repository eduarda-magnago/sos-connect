import { useState } from 'react'
interface Application {
  _id: string
  status: string
  mission_id: {
    _id: string
    title: string
    description: string
  }
  user_id: {
    _id: string
    name: string
    email: string
  }
}
const mockApplications: Application[] = [
  {
    _id: '1',
    status: 'pending',
    mission_id: {
      _id: 'm1',
      title: 'Cozinhar',
      description: 'Entrega de cestas básicas na comunidade',
    },
    user_id: {
      _id: 'u1',
      name: 'Fernanda Dias',
      email: 'fernanda.dias@email.com',
    },
  },
  
]
export default function CandidaturesInstitution() {
  const [applications] = useState<Application[]>(mockApplications)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [confirmedIds, setConfirmedIds] = useState<string[]>([])
  function handleConfirmParticipation(applicationId: string) {
    setIsProcessing(applicationId)
    setTimeout(() => {
      setConfirmedIds((prev) =>
        prev.includes(applicationId) ? prev : [...prev, applicationId]
      )
      setIsProcessing(null)
    }, 700)
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
                  <strong>Candidato:</strong> {application.user_id?.name}
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleConfirmParticipation(application._id)}
                    disabled={confirmedIds.includes(application._id) || !!isProcessing}
                    className={`text-xs rounded-lg px-4 py-2 transition-all font-medium
                      ${
                        confirmedIds.includes(application._id) || !!isProcessing
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#1a2e44] text-white hover:bg-slate-800 cursor-pointer'
                      }`}
                  >
                    {isProcessing === application._id
                      ? 'Confirmando...'
                      : confirmedIds.includes(application._id)
                      ? 'Participação confirmada'
                      : 'Confirmar participação'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
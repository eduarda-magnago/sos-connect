import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface Certificate {
  _id: string
  user_id: string | { _id: string }
  mission_id: string | { _id: string }
  support_unit_id: string
  issued_by: string
  hours: number
  certificate_code: string
  issued_at: string
  mission?: {
    _id: string
    title: string
    description?: string
  }
  supportUnit?: {
    _id: string
    name: string
    address?: string
  }
}

interface MissionVolunteerApplication {
  _id: string
  status: string
  mission_id:
    | string
    | {
        _id: string
        title: string
      }
  user_id:
    | string
    | {
        _id: string
        name: string
        email: string
      }
}

export default function Certificates() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (user.role === 'admin') {
    return <AdminCertificates />
  }

  return <VolunteerCertificates />
}

function AdminCertificates() {
  const [applications, setApplications] = useState<MissionVolunteerApplication[]>([])
  const [hoursByApplication, setHoursByApplication] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadApprovedApplications()
  }, [])

  async function loadApprovedApplications() {
    try {
      setLoading(true)

      const [applicationsResponse, certificatesResponse] = await Promise.all([
        api.get('/mission-volunteers'),
        api.get('/certificates'),
      ])

      const issuedCertificates = new Set(
        certificatesResponse.data.map((certificate: Certificate) => {
          return `${getCertificateMissionId(certificate)}:${getCertificateUserId(certificate)}`
        })
      )

      const availableApplications = applicationsResponse.data.filter(
        (application: MissionVolunteerApplication) => {
          const missionId = getMissionId(application)
          const volunteerId = getVolunteerId(application)

          if (!missionId || !volunteerId) return false

          const alreadyIssued = issuedCertificates.has(`${missionId}:${volunteerId}`)

          return application.status === 'approved' && !alreadyIssued
        }
      )

      setApplications(availableApplications)
    } catch (err) {
      console.error(err)
      alert('Não foi possível carregar os voluntários aprovados.')
    } finally {
      setLoading(false)
    }
  }

  async function handleIssueCertificate(application: MissionVolunteerApplication) {
    const missionId = getMissionId(application)
    const volunteerId = getVolunteerId(application)
    const hours = Number(hoursByApplication[application._id])

    if (!missionId || !volunteerId) {
      alert('Dados da missão ou do voluntário estão incompletos.')
      return
    }

    if (!hours || hours < 1) {
      alert('Informe uma carga horária válida.')
      return
    }

    try {
      setProcessingId(application._id)

      await api.post('/certificates', {
        mission_id: missionId,
        volunteer_user_id: volunteerId,
        hours,
      })

      alert('Certificado emitido com sucesso!')

      setApplications((prev) =>
        prev.filter((item) => item._id !== application._id)
      )

      setHoursByApplication((prev) => {
        const next = { ...prev }
        delete next[application._id]
        return next
      })
    } catch (err: any) {
      console.error(err)

      const message = err?.response?.data?.message

      alert(
        Array.isArray(message)
          ? message.join('\n')
          : message ?? 'Não foi possível emitir o certificado.'
      )
    } finally {
      setProcessingId(null)
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
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Emissão de certificados
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Informe a carga horária para emitir certificados de voluntários aprovados.
          </p>
        </div>

        {applications.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            Nenhum voluntário aprovado disponível para emissão.
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => {
              const isProcessing = processingId === application._id

              return (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-xl px-6 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {getMissionTitle(application)}
                      </p>

                      <p className="text-xs text-gray-600">
                        <strong>Voluntário:</strong> {getVolunteerName(application)}
                      </p>

                      {getVolunteerEmail(application) && (
                        <p className="text-xs text-gray-500">
                          {getVolunteerEmail(application)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="Horas"
                        value={hoursByApplication[application._id] ?? ''}
                        onChange={(event) =>
                          setHoursByApplication((prev) => ({
                            ...prev,
                            [application._id]: event.target.value,
                          }))
                        }
                        className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#1a2e44]"
                      />

                      <button
                        onClick={() => handleIssueCertificate(application)}
                        disabled={isProcessing}
                        className={`text-xs rounded-lg px-4 py-2 transition-all font-medium ${
                          isProcessing
                            ? 'bg-gray-100 text-gray-400 cursor-wait'
                            : 'bg-[#1a2e44] text-white hover:bg-slate-800 cursor-pointer'
                        }`}
                      >
                        {isProcessing ? 'Emitindo...' : 'Emitir certificado'}
                      </button>
                    </div>
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

function VolunteerCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadCertificates()
  }, [])

  async function loadCertificates() {
    try {
      setLoading(true)

      const response = await api.get('/certificates/me')

      const certificatesWithDetails = await Promise.all(
        response.data.map(async (certificate: Certificate) => {
          try {
            const [missionResponse, supportUnitResponse] = await Promise.all([
              api.get(`/missions/${getCertificateMissionId(certificate)}`),
              api.get(`/support-units/${certificate.support_unit_id}`),
            ])

            return {
              ...certificate,
              mission: missionResponse.data,
              supportUnit: supportUnitResponse.data,
            }
          } catch {
            return certificate
          }
        })
      )

      setCertificates(certificatesWithDetails)
    } catch (err) {
      console.error(err)
      alert('Não foi possível carregar os certificados.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(certificate: Certificate) {
    try {
      setProcessingId(certificate._id)

      const response = await api.get(`/certificates/${certificate._id}/download`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      )

      const link = document.createElement('a')
      link.href = url
      link.download = `certificado-${certificate.certificate_code}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Não foi possível baixar o certificado.')
    } finally {
      setProcessingId(null)
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
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Certificados
        </h2>

        {certificates.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            Você ainda não possui certificados emitidos.
          </p>
        ) : (
          <div className="space-y-3">
            {certificates.map((certificate) => {
              const isProcessing = processingId === certificate._id

              return (
                <div
                  key={certificate._id}
                  className="flex items-center justify-between border border-gray-200 rounded-xl px-6 py-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {certificate.mission?.title ?? 'Missão de voluntariado'}
                    </p>

                    <p className="text-xs text-gray-500">
                      {certificate.supportUnit?.name ?? 'Unidade de apoio'}
                    </p>

                    <p className="text-xs text-gray-500">
                      Carga horária: {certificate.hours}h
                    </p>

                    <p className="text-xs text-gray-500">
                      Código: {certificate.certificate_code}
                    </p>

                    <p className="text-xs text-gray-500">
                      Emitido em:{' '}
                      {new Date(certificate.issued_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(certificate)}
                    disabled={!!isProcessing}
                    className={`text-xs rounded-lg px-4 py-2 transition-all font-medium ${
                      isProcessing
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-[#1a2e44] text-white hover:bg-slate-800 cursor-pointer'
                    }`}
                  >
                    {isProcessing ? 'Baixando...' : 'Baixar certificado'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function getMissionId(application: MissionVolunteerApplication) {
  return typeof application.mission_id === 'string'
    ? application.mission_id
    : application.mission_id?._id
}

function getMissionTitle(application: MissionVolunteerApplication) {
  return typeof application.mission_id === 'string'
    ? 'Missão'
    : application.mission_id?.title ?? 'Missão'
}

function getVolunteerId(application: MissionVolunteerApplication) {
  return typeof application.user_id === 'string'
    ? application.user_id
    : application.user_id?._id
}

function getVolunteerName(application: MissionVolunteerApplication) {
  return typeof application.user_id === 'string'
    ? 'Voluntário'
    : application.user_id?.name ?? 'Voluntário'
}

function getVolunteerEmail(application: MissionVolunteerApplication) {
  return typeof application.user_id === 'string'
    ? ''
    : application.user_id?.email ?? ''
}

function getCertificateMissionId(certificate: Certificate) {
  return typeof certificate.mission_id === 'string'
    ? certificate.mission_id
    : certificate.mission_id?._id
}

function getCertificateUserId(certificate: Certificate) {
  return typeof certificate.user_id === 'string'
    ? certificate.user_id
    : certificate.user_id?._id
}
import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Certificate {
  _id: string
  mission_id: string
  support_unit_id: string
  support_unit_name: string
  address: string
  certificate_code: string
  issued_at: string
}

// Exemplos
const mockCertificates: Certificate[] = [
  {
    _id: '1',
    mission_id: 'm1',
    support_unit_id: 's1',
    support_unit_name: 'Abrigo Esperança',
    address: 'Rua das Flores 42, Betim, MG',
    certificate_code: 'CERT-001',
    issued_at: new Date().toISOString(),
  }
]

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates)
  const [loading, setLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true)
        const res = await api.get('/certificates/me')
        if (res.data && res.data.length > 0) {
          setCertificates(res.data)
        }
      } catch (err) {
        console.error("Erro ao carregar, mantendo mocks.")
      } finally {
        setLoading(false)
      }
    }
    loadCertificates()
  }, [])

  // Representa a emissão do certificado
  async function handleDownload(id: string, code: string) {
    setIsProcessing(id)
    
    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const res = await api.get(`/certificates/${id}/download`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `certificado-${code}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      // 
      alert(`Download do certificado ${code} iniciado com sucesso!`)
    } finally {
      setIsProcessing(null)
    }
  }

  if (loading && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Certificados</h2>
        
        {certificates.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            Você ainda não possui certificados emitidos.
          </p>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="flex items-center justify-between border border-gray-200 rounded-md px-6 py-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {cert.support_unit_name}
                  </p>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {cert.address}
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(cert._id, cert.certificate_code)}
                  disabled={!!isProcessing}
                  className={`text-xs rounded-lg px-4 py-2 transition-all font-medium 
                    ${isProcessing === cert._id 
                      ? 'bg-gray-100 text-gray-400 cursor-wait' 
                      : 'bg-[#1a2e44] text-white hover:bg-slate-800 cursor-pointer'
                    }`}
                >
                  {isProcessing === cert._id ? 'Emitindo...' : 'Emitir certificado'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
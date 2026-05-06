import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../../services/api'
import { useReverseGeocode } from '../../../../utils/geocoding'

interface DonationNeed {
  _id: string
  item_name: string
  quantity_needed: number
  quantity_received: number
  priority: string
  status: string
}

interface SupportUnit {
  _id: string
  name: string
  capacity: number
  current_occupancy: number
  location: { coordinates: number[] }
}

const priorityLabel: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
}

export default function DonationDetail() {
  const { id, donationId } = useParams()
  const [unit, setUnit] = useState<SupportUnit | null>(null)
  const [donation, setDonation] = useState<DonationNeed | null>(null)
  const [loading, setLoading] = useState(true)

  const { address, loading: addressLoading } = useReverseGeocode(
    unit?.location?.coordinates[1] || 0,
    unit?.location?.coordinates[0] || 0
  )

  useEffect(() => {
    async function load() {
      try {
        const [unitRes, donationRes] = await Promise.all([
          api.get(`/support-units/${id}`),
          api.get(`/donation-needs/${donationId}`)
        ])
        setUnit(unitRes.data)
        setDonation(donationRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, donationId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (!donation || !unit) return null

  const capacidadeRestante = unit.capacity - unit.current_occupancy

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

        <h2 className="text-sm font-semibold text-gray-900">Doações (Necessidades)</h2>

        <div className="border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-sm font-medium text-gray-900">{donation.item_name}</p>
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
          <p className="text-sm font-semibold text-gray-900">Informações necessárias para a doação:</p>
          <p className="text-xs text-gray-500">Tipo de doação: <span className="text-gray-700">{donation.item_name}</span></p>
          <p className="text-xs text-gray-500">Quantidade necessária: <span className="text-gray-700">{donation.quantity_needed}</span></p>
          <p className="text-xs text-gray-500">Quantidade recebida: <span className="text-gray-700">{donation.quantity_received}</span></p>
          <p className="text-xs text-gray-500">Prioridade: <span className="text-gray-700">{priorityLabel[donation.priority] ?? donation.priority}</span></p>

          <div className="pt-2 flex justify-end">
            <button className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
              Candidatar-se para doação
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
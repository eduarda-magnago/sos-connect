import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../services/api'
import { useReverseGeocode } from '../../../utils/geocoding'

interface DonationNeed {
  _id: string
  item_name: string
  quantity_needed: number
  priority?: 'low' | 'medium' | 'high'
}

interface SupportUnit {
  _id: string
  name: string
  location: { coordinates: number[] }
}

export default function Donations() {
  const { id } = useParams()
  const [unit, setUnit] = useState<SupportUnit | null>(null)
  const [donations, setDonations] = useState<DonationNeed[]>([])
  const [loading, setLoading] = useState(true)

  const { address, loading: addressLoading } = useReverseGeocode(
    unit?.location?.coordinates[1] || 0,
    unit?.location?.coordinates[0] || 0
  )

  useEffect(() => {
    async function load() {
      try {
        const [unitRes, donationsRes] = await Promise.all([
          api.get(`/support-units/${id}`),
          api.get(`/donation-needs?support_unit_id=${id}`)
        ])
        setUnit(unitRes.data)
        setDonations(donationsRes.data)
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

        <h2 className="text-sm font-semibold text-gray-900 mb-4">Doações (Necessidades)</h2>

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

        {donations.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">
            Nenhuma necessidade de doação cadastrada.
          </p>
        ) : (
          <div className="space-y-3">
            {donations.map((donation) => (
              <div
                key={donation._id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3"
              >
                <span className="text-sm text-gray-700">{donation.item_name}</span>
                <button className="text-xs border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                  Doar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import UnitCard from '../../components/UnitCard/Index'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface SupportUnit {
  _id: string
  name: string
  status: string
  validated: boolean
  capacity: number
  current_occupancy: number
  location: { coordinates: number[] }
  services_available: string[]
  support_unit_user_id: string
}

export default function SupportUnits() {
  const { user } = useAuth()
  const [myUnits, setMyUnits] = useState<SupportUnit[]>([])
  const [otherUnits, setOtherUnits] = useState<SupportUnit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUnits() {
      try {
        const response = await api.get('/support-units')
        const all: SupportUnit[] = response.data
        setMyUnits(all.filter(u => u.support_unit_user_id === user?._id))
        setOtherUnits(all.filter(u => u.support_unit_user_id !== user?._id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUnits()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-8">

          {/* Minhas unidades */}
          {myUnits.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Minhas Unidades de Apoio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myUnits.map((unit) => (
                  <UnitCard key={unit._id} unit={unit} role={user?.role || ''} isOwner />
                ))}
              </div>
            </section>
          )}

          {/* Outras unidades */}
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Unidades de Apoio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherUnits.map((unit) => (
                <UnitCard key={unit._id} unit={unit} role={user?.role || ''} />
              ))}
            </div>
          </section>

        </div>
    </div>
  )
}
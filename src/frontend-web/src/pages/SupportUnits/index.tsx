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
  contact: { email: string; phone: string }
}

export default function SupportUnits() {
  const { user } = useAuth()
  const [pendingUnits, setPendingUnits] = useState<SupportUnit[]>([])
  const [myUnits, setMyUnits] = useState<SupportUnit[]>([])
  const [otherUnits, setOtherUnits] = useState<SupportUnit[]>([])
  const [loading, setLoading] = useState(true)

  async function loadUnits() {
    setLoading(true)
    try {
      const response = await api.get('/support-units')
      const all: SupportUnit[] = response.data
      setMyUnits(all.filter(u => u.support_unit_user_id === user?._id))
      setOtherUnits(all.filter(u => u.support_unit_user_id !== user?._id))

      if (user?.role === 'admin') {
        const pendingResponse = await api.get('/support-units/pending')
        setPendingUnits(pendingResponse.data)
      } else {
        setPendingUnits([])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadUnits()
    }
  }, [user])

  async function handleApprove(unitId: string) {
    try {
      await api.patch(`/support-units/${unitId}/validate`, { approved: true })
      setPendingUnits(prev => prev.filter(unit => unit._id !== unitId))
      loadUnits()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(unitId: string) {
    try {
      await api.delete(`/support-units/${unitId}`)
      setPendingUnits(prev => prev.filter(unit => unit._id !== unitId))
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
    <div className="space-y-8">
      <div className="space-y-8">

        {user?.role === 'admin' && (
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Unidades de Apoio Pendentes</h2>
            {pendingUnits.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma unidade pendente no momento.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingUnits.map((unit) => (
                  <UnitCard
                    key={unit._id}
                    unit={unit}
                    role={user.role}
                    onApprove={handleApprove}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        )}

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
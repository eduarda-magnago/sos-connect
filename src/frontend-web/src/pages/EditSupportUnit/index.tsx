import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import SupportUnitForm, { type SupportUnitFormData } from '../../components/SupportUnitForm'
import api from '../../services/api'

export default function EditSupportUnit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState<Partial<SupportUnitFormData>>()

  useEffect(() => {
    async function loadUnit() {
      try {
        const response = await api.get(`/support-units/${id}`)
        const unit = response.data
        setInitialData({
          name:        unit.name,
          CNPJ:        unit.CNPJ,
          description: unit.description,
          email:       unit.contact?.email,
          phone:       unit.contact?.phone,
          status:      unit.status,
          capacity:    String(unit.capacity),
          lat:         String(unit.location?.coordinates[1]),
          lng:         String(unit.location?.coordinates[0]),
        })
      } catch {
        toast.error('Erro ao carregar unidade.')
        navigate('/support-units')
      }
    }
    loadUnit()
  }, [id])

  async function handleSubmit(data: SupportUnitFormData) {
    setLoading(true)
    try {
      await api.put(`/support-units/${id}`, {
        name:        data.name,
        description: data.description,
        contact:     { email: data.email, phone: data.phone },
        location:    { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
        capacity:    parseInt(data.capacity),
        status:      data.status,
      })
      toast.success('Unidade atualizada com sucesso!')
      navigate('/support-units')
    } catch {
      toast.error('Erro ao atualizar unidade.')
    } finally {
      setLoading(false)
    }
  }

  if (!initialData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'var(--color-muted)' }}>Carregando...</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-base font-semibold mb-6" style={{ color: 'var(--color-foreground)' }}>
        Editar Unidade de Apoio
      </h1>
      <SupportUnitForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
        loading={loading}
      />
    </>
  )
}
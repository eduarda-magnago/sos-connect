import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SupportUnitForm, { type SupportUnitFormData } from '../../components/SupportUnitForm/index'
import api from '../../services/api'

export default function CreateSupportUnit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data: SupportUnitFormData) {
    setLoading(true)
    try {
      await api.post('/support-units', {
        name:        data.name,
        CNPJ:        data.CNPJ,
        description: data.description,
        contact:     { email: data.email, phone: data.phone },
        location:    { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
        capacity:    parseInt(data.capacity),
        status:      data.status,
      })
      toast.success('Unidade criada! Aguarde a validação do admin.')
      navigate('/support-units')
    } catch {
      toast.error('Erro ao criar unidade. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-base font-semibold mb-6" style={{ color: 'var(--color-foreground)' }}>
        Criar nova Unidade de Apoio
      </h1>
      <SupportUnitForm
        onSubmit={handleSubmit}
        submitLabel="Criar"
        loading={loading}
      />
    </>
  )
}
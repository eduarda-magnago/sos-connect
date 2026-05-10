import { useState } from 'react'
import FormField from '../FormField'
import FormSelect from '../FormSelect'
import UnitUpload from '../UnitUpload'
import LocationField from '../LocationField'

export interface SupportUnitFormData {
  name: string
  email: string
  phone: string
  CNPJ: string
  description: string
  status: string
  capacity: string
  lat: string
  lng: string
}

interface SupportUnitFormProps {
  initialData?: Partial<SupportUnitFormData>
  onSubmit: (data: SupportUnitFormData) => Promise<void>
  submitLabel?: string
  loading?: boolean
}

const statusOptions = [
  { value: 'open',   label: 'Disponível' },
  { value: 'full',   label: 'Lotado' },
  { value: 'closed', label: 'Fechado' },
]

const defaultData: SupportUnitFormData = {
  name: '', email: '', phone: '', CNPJ: '',
  description: '', status: 'open', capacity: '', lat: '', lng: '',
}

export default function SupportUnitForm({
  initialData,
  onSubmit,
  submitLabel = 'Criar',
  loading = false,
}: SupportUnitFormProps) {
  const [form, setForm] = useState<SupportUnitFormData>({
    ...defaultData,
    ...initialData,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleLocationChange(lat: string, lng: string) {
    setForm({ ...form, lat, lng })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl shadow-sm p-8"
      style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      <UnitUpload />

      <div className="grid grid-cols-2 gap-6">
        <FormField
          label="Nome da Instituição"
          name="name"
          placeholder="Digite o nome"
          value={form.name}
          onChange={handleChange}
          required
        />

        <LocationField
          lat={form.lat}
          lng={form.lng}
          onLocationChange={handleLocationChange}
        />

        <FormField
          label="E-mail"
          name="email"
          type="email"
          placeholder="email@gmail.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Telefone"
            name="phone"
            placeholder="+55 31 9653-5457"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <FormField
            label="CNPJ"
            name="CNPJ"
            placeholder="00.000.000/0001-00"
            value={form.CNPJ}
            onChange={handleChange}
            required
          />
        </div>

        <FormField
          as="textarea"
          label="Descrição"
          name="description"
          placeholder="Faça uma descrição"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statusOptions}
          />
          <FormField
            label="Capacidade"
            name="capacity"
            type="number"
            placeholder="000"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {loading ? `${submitLabel}...` : submitLabel}
        </button>
      </div>
    </form>
  )
}
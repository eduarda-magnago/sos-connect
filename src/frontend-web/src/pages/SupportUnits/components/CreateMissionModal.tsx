import { useEffect, useState } from 'react'

export interface MissionFormData {
  title: string
  description: string
  category: string
  volunteers_needed: number
  date: string
  contact_phone?: string
  delivery_time?: string
}

interface CreateMissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MissionFormData) => Promise<void>
  initialValues?: Partial<MissionFormData>
  mode?: 'create' | 'edit'
}

const categoryOptions = [
  { value: 'cozinha', label: 'Cozinha' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'medico', label: 'Médico' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'cuidado_infantil', label: 'Cuidado Infantil' },
  { value: 'construcao', label: 'Construção' },
  { value: 'distribuicao', label: 'Distribuição' },
  { value: 'outro', label: 'Outro' },
]

function toDateInputValue(value?: string) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function CreateMissionModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode = 'create',
}: CreateMissionModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [volunteersNeeded, setVolunteersNeeded] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('cozinha')
  const [contactPhone, setContactPhone] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setTitle(initialValues?.title ?? '')
    setDate(toDateInputValue(initialValues?.date))
    setVolunteersNeeded(
      initialValues?.volunteers_needed != null
        ? String(initialValues.volunteers_needed)
        : ''
    )
    setDescription(initialValues?.description ?? '')
    setCategory(initialValues?.category ?? 'cozinha')
    setContactPhone(initialValues?.contact_phone ?? '')
    setDeliveryTime(initialValues?.delivery_time ?? '')
  }, [isOpen, initialValues])

  if (!isOpen) return null

  const isValid =
    title.trim() &&
    date &&
    volunteersNeeded &&
    Number(volunteersNeeded) > 0 &&
    description.trim()

  async function handleSubmit() {
    if (!isValid) return

    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        volunteers_needed: Number(volunteersNeeded),
        date: new Date(date).toISOString(),
        contact_phone: contactPhone.trim() || undefined,
        delivery_time: deliveryTime.trim() || undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="max-h-[92vh] w-[410px] overflow-y-auto rounded-md bg-white px-8 py-9 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-gray-900">
              {mode === 'edit' ? 'Editar Missão' : 'Crie uma Missão'}
            </h2>

            <p className="mt-4 max-w-[330px] text-[11px] leading-[16px] text-gray-700">
              As missões cadastradas serão disponibilizadas para voluntários,
              permitindo a organização e execução de ações para atender às
              demandas da instituição.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[20px] leading-none text-gray-900 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-900">
              Nome Missão
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Cobertor"
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">
              Quantidade necessária
            </label>
            <input
              type="number"
              min={1}
              value={volunteersNeeded}
              onChange={(e) => setVolunteersNeeded(e.target.value)}
              placeholder="Escreva a quantidade necessária"
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">
              Detalhes do pedido
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva informações detalhadas da sua doação"
              rows={3}
              className="mt-2 w-full rounded border border-gray-300 px-4 py-2 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">
              Telefone de contato
            </label>
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Digite o telefone"
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">
              Horário de Entrega
            </label>
            <input
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="Digite o horário"
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="h-[36px] w-full rounded bg-[#102946] text-[11px] font-semibold text-white disabled:bg-gray-400"
          >
            {loading
              ? mode === 'edit'
                ? 'Salvando...'
                : 'Criando...'
              : mode === 'edit'
                ? 'Salvar alterações'
                : 'Criar missão'}
          </button>
        </div>
      </div>
    </div>
  )
}
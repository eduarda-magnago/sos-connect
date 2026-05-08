import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    fullName: string
    email: string
    availability: string
    accepted: boolean
  }) => Promise<void>
}

export default function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const { user } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [availability, setAvailability] = useState('yes')
  const [accepted, setAccepted] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.name || '')
      setEmail(user.email || '')
    }
  }, [isOpen, user])

  if (!isOpen) return null

  async function handleSubmit() {
    if (!fullName || !email || !accepted) return

    setLoading(true)
    try {
      await onSubmit({ fullName, email, availability, accepted })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[410px] rounded-md bg-white px-8 py-9 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-gray-900">
              Preencha o formulário
            </h2>

            <p className="mt-4 max-w-[330px] text-[11px] leading-[16px] text-gray-700">
              Seus dados precisam ser enviados à instituição para que eles possam
              ter o controle da quantidade de participantes.
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
            <label className="text-[11px] font-bold text-gray-900">Nome</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Digite seu nome completo"
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-900">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              className="mt-2 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            />
          </div>

          <div>
            <label className="block max-w-[320px] text-[11px] font-bold leading-[15px] text-gray-900">
              Você possui disponibilidade para comparecer no horário proposto?
            </label>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="mt-3 h-[30px] w-full rounded border border-gray-300 px-4 text-[10px] text-gray-700 outline-none focus:border-[#102946]"
            >
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </div>

          <label className="flex items-start gap-3 text-[10px] leading-[16px] text-gray-700">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-[2px] h-[13px] w-[13px] accent-green-600"
            />

            <span>
              Concordo que li todas as informações para exercer essa atividade.
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !fullName || !email || !accepted}
            className="h-[30px] w-full rounded bg-[#102946] text-[10px] font-semibold text-white disabled:bg-gray-400"
          >
            {loading ? 'Enviando...' : 'Enviar candidatura'}
          </button>
        </div>
      </div>
    </div>
  )
}
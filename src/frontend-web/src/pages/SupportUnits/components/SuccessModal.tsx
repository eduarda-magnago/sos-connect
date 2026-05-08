interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[360px] rounded-md bg-white px-8 py-7 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold text-gray-900">
              Candidatura enviada com sucesso
            </h2>

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[12px] font-bold text-white">
              ✓
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[20px] leading-none text-gray-900 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <p className="max-w-[280px] text-[11px] leading-[16px] text-gray-700">
          Vá no seu menu lateral e visualize sua candidatura na aba de
          “Candidaturas”.
        </p>
      </div>
    </div>
  )
}
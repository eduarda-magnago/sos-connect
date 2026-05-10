import { useRef, useState } from 'react'

interface UnitUploadProps {
  onChange?: (file: File) => void
  preview?: string
}

export default function UnitUpload({ onChange, preview }: UnitUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(preview || null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLocalPreview(URL.createObjectURL(file))
    onChange?.(file)
  }

  return (
    <div className="flex items-center gap-6 mb-8">
      <div
        className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        {localPreview ? (
          <img src={localPreview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl"></span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
          Adicione uma foto da sua unidade de apoio.
        </p>
        <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
          Faça o upload da sua foto.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs rounded-lg px-4 py-1.5 transition-colors hover:opacity-80"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
        >
          Escolher arquivo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  )
}
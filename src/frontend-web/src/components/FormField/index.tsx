import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  error?: string
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input'
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
  rows?: number
}

type FormFieldProps = InputProps | TextareaProps

const inputClass = `
  w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
  focus:ring-red-400 transition-colors
`

export default function FormField(props: FormFieldProps) {
  const { label, error, as = 'input', ...rest } = props

  return (
    <div className="space-y-1">
      <label className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {label}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={inputClass + ' resize-none'}
          style={{ border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}` }}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={inputClass}
          style={{ border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}` }}
        />
      )}

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
      )}
    </div>
  )
}
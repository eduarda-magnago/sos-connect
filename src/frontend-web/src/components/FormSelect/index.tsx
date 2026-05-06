import { type SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: string
}

export default function FormSelect({ label, options, error, ...rest }: FormSelectProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {label}
      </label>
      <select
        {...rest}
        className="w-full rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
        style={{ border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}` }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>
      )}
    </div>
  )
}
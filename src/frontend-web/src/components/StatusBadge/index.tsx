interface StatusBadgeProps {
  status: string
}

const config: Record<string, { label: string; color: string }> = {
  open:   { label: 'Disponível', color: '#22C55E' },
  full:   { label: 'Lotado',     color: '#F59E0B' },
  closed: { label: 'Fechado',    color: '#EF4444' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = config[status] || { label: status, color: '#6B7280' }

  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
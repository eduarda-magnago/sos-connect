import { Circle } from 'phosphor-react'

interface StatusBadgeProps {
  status: string
}

const config: Record<string, { label: string; color: string; img?: string }> = {
  open:   { label: 'Disponível', color: '#22C55E', img: '/icons/green-circle.png' },
  full:   { label: 'Lotado',     color: '#F59E0B' },
  closed: { label: 'Fechado',    color: '#EF4444' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color, img } = config[status] || { label: status, color: '#6B7280' }

  return (
     <span className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
      {img
        ? <img src={img} alt="disponível" className="w-6 h-6" />
        : <Circle size={10} weight="fill" color={color} />
      }
      {label}
    </span>
  )
}
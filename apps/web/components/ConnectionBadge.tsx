import type { ConnectionStatus } from '@/lib/ws-client'

const statusConfig: Record<ConnectionStatus, { label: string; color: string; dot: string }> = {
  connecting: { label: 'Connecting…', color: 'text-yellow-300', dot: 'bg-yellow-400 animate-pulse' },
  connected: { label: 'Connected', color: 'text-green-300', dot: 'bg-green-400' },
  disconnected: { label: 'Disconnected', color: 'text-red-400', dot: 'bg-red-500' },
  reconnecting: { label: 'Reconnecting…', color: 'text-orange-300', dot: 'bg-orange-400 animate-pulse' },
}

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const { label, color, dot } = statusConfig[status]
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </div>
  )
}

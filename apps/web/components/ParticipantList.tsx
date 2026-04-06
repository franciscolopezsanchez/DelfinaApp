import type { Participant } from '@christmas-carol/types'

export function ParticipantList({ participants, myId }: { participants: Participant[]; myId: string }) {
  return (
    <div className="card space-y-3">
      <h3 className="font-semibold text-christmas-gold text-sm uppercase tracking-wide">
        🎁 Singers ({participants.length})
      </h3>
      <ul className="space-y-2">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm">
            <span>{p.isDirector ? '🎄' : '🎵'}</span>
            <span className="flex-1">{p.name}</span>
            {p.id === myId && (
              <span className="text-xs bg-christmas-gold/20 text-christmas-gold px-2 py-0.5 rounded-full">
                you
              </span>
            )}
            {p.isDirector && (
              <span className="text-xs bg-christmas-red/20 text-red-300 px-2 py-0.5 rounded-full">
                director
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

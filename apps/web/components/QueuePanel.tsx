'use client'
import type { Song } from '@christmas-carol/types'

interface QueuePanelProps {
  queue: Song[]
  onPick: (songId: string) => void
}

export function QueuePanel({ queue, onPick }: QueuePanelProps) {
  return (
    <div className="card space-y-3">
      <h3 className="font-semibold text-christmas-gold text-sm uppercase tracking-wide">
        🎼 Song Queue ({queue.length})
      </h3>
      {queue.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-4">
          Queue is empty. Add some carols!
        </p>
      ) : (
        <ul className="space-y-2">
          {queue.map((song) => (
            <li
              key={song.id}
              className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{song.title}</p>
                <p className="text-white/50 text-xs truncate">{song.artist}</p>
              </div>
              <button
                onClick={() => onPick(song.id)}
                className="shrink-0 text-xs bg-christmas-red hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition-all active:scale-95"
              >
                ▶ Play
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

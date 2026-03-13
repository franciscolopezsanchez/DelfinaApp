'use client'
import { useState } from 'react'
import type { Song } from '@christmas-carol/types'

export function SongView({ song }: { song: Song | null }) {
  const [showChords, setShowChords] = useState(false)

  if (!song) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="text-6xl">🎵</div>
        <p className="text-white/50 text-lg">Waiting for the director to pick a song…</p>
        <p className="text-white/30 text-sm">Songs will appear here once the party starts!</p>
      </div>
    )
  }

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-christmas-gold leading-tight">
            {song.title}
          </h2>
          <p className="text-white/60 text-sm mt-1">{song.artist}</p>
        </div>
        {song.chords && (
          <button
            onClick={() => setShowChords(!showChords)}
            className={`btn-ghost text-xs shrink-0 ${showChords ? 'bg-christmas-gold/20' : ''}`}
          >
            🎸 {showChords ? 'Hide chords' : 'Chords'}
          </button>
        )}
      </div>

      {/* Chords */}
      {showChords && song.chords && (
        <div className="bg-black/30 rounded-xl p-4 font-mono text-sm text-christmas-gold whitespace-pre-wrap border border-christmas-gold/20">
          {song.chords}
        </div>
      )}

      {/* Lyrics */}
      <div className="max-h-[60vh] overflow-y-auto pr-1">
        <pre className="whitespace-pre-wrap font-sans text-christmas-cream leading-relaxed text-base">
          {song.lyrics}
        </pre>
      </div>
    </div>
  )
}

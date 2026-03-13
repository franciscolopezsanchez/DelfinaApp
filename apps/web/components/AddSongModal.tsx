'use client'
import { useState } from 'react'
import { getCarolLibrary, carolToSong } from '@/lib/song-api'
import type { Song } from '@christmas-carol/types'

interface AddSongModalProps {
  onAdd: (song: Omit<Song, 'id' | 'addedBy'>) => void
  onClose: () => void
  isDirector: boolean
}

type Tab = 'library' | 'manual'

export function AddSongModal({ onAdd, onClose, isDirector }: AddSongModalProps) {
  const [tab, setTab] = useState<Tab>('library')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ title: '', artist: '', lyrics: '', chords: '' })
  const [formError, setFormError] = useState('')

  const library = getCarolLibrary()
  const filtered = library.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.artist.toLowerCase().includes(search.toLowerCase())
  )

  function handleLibraryAdd(carol: ReturnType<typeof getCarolLibrary>[number]) {
    onAdd(carolToSong(carol, ''))
    onClose()
  }

  function handleManualSubmit() {
    if (!form.title.trim() || !form.artist.trim() || !form.lyrics.trim()) {
      setFormError('Title, artist and lyrics are required')
      return
    }
    onAdd({
      title: form.title.trim(),
      artist: form.artist.trim(),
      lyrics: form.lyrics.trim(),
      chords: form.chords.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-christmas-darkgreen border border-white/20 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-christmas-gold">
            🎶 Add a Song
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(['library', 'manual'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                tab === t
                  ? 'text-christmas-gold border-b-2 border-christmas-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {t === 'library' ? '📚 Carol Library' : '✏️ Add Manually'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'library' && (
            <>
              <input
                className="input"
                placeholder="Search carols…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ul className="space-y-2">
                {filtered.map((carol) => (
                  <li
                    key={carol.id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{carol.title}</p>
                      <p className="text-white/50 text-xs">{carol.artist}</p>
                    </div>
                    <button
                      onClick={() => handleLibraryAdd(carol)}
                      className="shrink-0 text-xs btn-secondary py-1.5 px-3"
                    >
                      + Add
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <p className="text-white/40 text-center text-sm py-4">
                    No carols found.
                  </p>
                )}
              </ul>
            </>
          )}

          {tab === 'manual' && (
            <div className="space-y-4">
              {formError && (
                <p className="text-red-400 text-sm">{formError}</p>
              )}
              <div>
                <label className="block text-xs font-semibold text-christmas-gold mb-1">
                  Title *
                </label>
                <input
                  className="input"
                  placeholder="Silent Night"
                  value={form.title}
                  onChange={(e) => { setForm(f => ({ ...f, title: e.target.value })); setFormError('') }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-christmas-gold mb-1">
                  Artist *
                </label>
                <input
                  className="input"
                  placeholder="Traditional"
                  value={form.artist}
                  onChange={(e) => setForm(f => ({ ...f, artist: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-christmas-gold mb-1">
                  Lyrics *
                </label>
                <textarea
                  className="input min-h-[120px] resize-none"
                  placeholder="Paste lyrics here…"
                  value={form.lyrics}
                  onChange={(e) => setForm(f => ({ ...f, lyrics: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-christmas-gold mb-1">
                  Chords <span className="text-white/40 font-normal">(optional)</span>
                </label>
                <textarea
                  className="input min-h-[80px] resize-none font-mono text-sm"
                  placeholder="G  D  Em  C…"
                  value={form.chords}
                  onChange={(e) => setForm(f => ({ ...f, chords: e.target.value }))}
                />
              </div>
              <button className="btn-primary w-full" onClick={handleManualSubmit}>
                Add to Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

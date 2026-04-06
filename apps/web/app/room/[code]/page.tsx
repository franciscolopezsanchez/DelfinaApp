'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Room, Song } from '@christmas-carol/types'
import { useWebSocket } from '@/lib/ws-client'
import { ConnectionBadge } from '@/components/ConnectionBadge'
import { SongView } from '@/components/SongView'
import { ParticipantList } from '@/components/ParticipantList'
import { QueuePanel } from '@/components/QueuePanel'
import { AddSongModal } from '@/components/AddSongModal'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params.code as string).toUpperCase()

  const [name, setName] = useState<string | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [myId, setMyId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const joinedRef = useRef(false)

  // Redirect to home if no name saved
  useEffect(() => {
    const stored = sessionStorage.getItem('carolName')
    if (!stored) {
      router.replace('/')
    } else {
      setName(stored)
    }
  }, [router])

  const handleMessage = useCallback((type: string, payload: unknown) => {
    const p = payload as Record<string, unknown>
    switch (type) {
      case 'room:state': {
        const incoming = p.room as Room
        setRoom(incoming)
        setMyId(p.myId as string)
        // Redirect /room/new → /room/XMAS-XXXX without reloading
        if (code === 'NEW') {
          window.history.replaceState(null, '', `/room/${incoming.code}`)
        }
        break
      }
      case 'room:participants': {
        const participants = p.participants as Room['participants']
        setRoom((prev) => prev ? { ...prev, participants } : prev)
        const prevCount = room?.participants.length ?? 0
        if (participants.length > prevCount) {
          const newPerson = participants[participants.length - 1]
          if (newPerson.id !== myId) {
            toast(`🎁 ${newPerson.name} joined the party!`)
          }
        } else if (participants.length < prevCount) {
          toast('Someone left the party')
        }
        break
      }
      case 'song:current': {
        const song = p.song as Song | null
        setRoom((prev) => prev ? { ...prev, currentSong: song } : prev)
        if (song) toast.success(`🎵 Now playing: ${song.title}`)
        break
      }
      case 'song:queue': {
        const queue = p.queue as Song[]
        setRoom((prev) => prev ? { ...prev, songQueue: queue } : prev)
        toast(`🎼 Queue updated (${queue.length} song${queue.length !== 1 ? 's' : ''})`)
        break
      }
      case 'error': {
        toast.error(p.message as string)
        break
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId, code])

  const { send, status } = useWebSocket(handleMessage)

  // Join room once connected + name is ready
  useEffect(() => {
    if (status === 'connected' && name && !joinedRef.current) {
      joinedRef.current = true
      send('room:join', {
        code: code === 'NEW' ? null : code,
        name,
      })
    }
    // Re-join after reconnect
    if (status === 'connecting') joinedRef.current = false
  }, [status, name, code, send])

  function handleAddSong(song: Omit<Song, 'id' | 'addedBy'>) {
    send('song:add', { song })
  }

  function handlePickSong(songId: string) {
    send('song:pick', { songId })
  }

  const isDirector = room?.participants.find((p) => p.id === myId)?.isDirector ?? false
  const displayCode = room?.code ?? (code !== 'NEW' ? code : '…')

  if (!name) return null // waiting for sessionStorage check

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto space-y-4">
      {/* Top bar */}
      <header className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            ← Home
          </button>
          <div className="bg-christmas-gold/20 border border-christmas-gold/40 rounded-lg px-3 py-1">
            <span className="font-mono font-bold text-christmas-gold tracking-widest text-sm">
              {displayCode}
            </span>
          </div>
          {isDirector && (
            <span className="text-xs bg-christmas-red/20 text-red-300 px-2 py-1 rounded-full border border-christmas-red/30">
              Director
            </span>
          )}
        </div>
        <ConnectionBadge status={status} />
      </header>

      {/* Loading state */}
      {!room && status === 'connected' && (
        <div className="card text-center py-12 text-white/50">
          Joining room…
        </div>
      )}

      {!room && status !== 'connected' && (
        <div className="card text-center py-12 text-white/50 space-y-2">
          <p className="text-4xl">🔌</p>
          <p>Connecting to server…</p>
        </div>
      )}

      {room && (
        <>
          {/* Current song */}
          <SongView song={room.currentSong} />

          {/* Director: queue panel */}
          {isDirector && (
            <QueuePanel queue={room.songQueue} onPick={handlePickSong} />
          )}

          {/* Participants */}
          <ParticipantList participants={room.participants} myId={myId ?? ''} />

          {/* Add song button */}
          <div className="pb-6">
            <button
              className="btn-secondary w-full"
              onClick={() => setShowModal(true)}
            >
              🎶 Add a song
            </button>
          </div>
        </>
      )}

      {showModal && (
        <AddSongModal
          onAdd={handleAddSong}
          onClose={() => setShowModal(false)}
          isDirector={isDirector}
        />
      )}
    </main>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function saveName() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name')
      return null
    }
    sessionStorage.setItem('carolName', trimmed)
    return trimmed
  }

  function handleCreate() {
    if (!saveName()) return
    router.push('/room/new')
  }

  function handleJoin() {
    if (!saveName()) return
    const trimmedCode = code.trim().toUpperCase()
    if (!trimmedCode) {
      setError('Please enter a room code')
      return
    }
    router.push(`/room/${trimmedCode}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-7xl">🎄</div>
          <h1 className="text-4xl font-display font-bold text-christmas-gold">
            Christmas Carols
          </h1>
          <p className="text-white/60">Sing together in real-time</p>
        </div>

        {/* Name input */}
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-semibold text-christmas-gold mb-2">
              Your name
            </label>
            <input
              className="input"
              placeholder="e.g. Grandma"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              maxLength={30}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Create party */}
        <div className="card space-y-3">
          <h2 className="font-semibold text-christmas-gold">Start a party</h2>
          <p className="text-sm text-white/60">You&apos;ll be the director — you control which song is playing.</p>
          <button className="btn-primary w-full" onClick={handleCreate}>
            🎅 Create party
          </button>
        </div>

        {/* Join */}
        <div className="card space-y-3">
          <h2 className="font-semibold text-christmas-gold">Join a party</h2>
          <input
            className="input uppercase tracking-widest"
            placeholder="Room code (e.g. XMAS-4821)"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            maxLength={10}
          />
          <button className="btn-secondary w-full" onClick={handleJoin}>
            🎶 Join party
          </button>
        </div>
      </div>
    </main>
  )
}

import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { Song } from '@christmas-carol/types'
import { getRoom, addSong, pickSong } from '../room-manager'
import { broadcast, send, clientRooms, clients } from '../index'

export function handleSongAdd(
  ws: WebSocket,
  clientId: string,
  payload: Omit<Song, 'id' | 'addedBy'>
) {
  const code = clientRooms.get(clientId)
  if (!code) {
    send(ws, 'error', { message: 'Not in a room' })
    return
  }
  const song: Song = { ...payload, id: uuidv4(), addedBy: clientId }
  const room = addSong(code, song)
  if (!room) return
  broadcast(code, 'song:queue', { queue: room.songQueue })
}

export function handleSongPick(
  ws: WebSocket,
  clientId: string,
  payload: { songId: string }
) {
  const code = clientRooms.get(clientId)
  if (!code) {
    send(ws, 'error', { message: 'Not in a room' })
    return
  }
  const room = getRoom(code)
  if (!room) return

  const participant = room.participants.find(p => p.id === clientId)
  if (!participant?.isDirector) {
    send(ws, 'error', { message: 'Only the director can pick songs' })
    return
  }

  const updated = pickSong(code, payload.songId)
  if (!updated) return
  broadcast(code, 'song:current', { song: updated.currentSong })
  broadcast(code, 'song:queue', { queue: updated.songQueue })
}

import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { Participant } from '@christmas-carol/types'
import { createRoom, getRoom, joinRoom, leaveRoom } from '../room-manager'
import { broadcast, send, clientRooms } from '../index'

export function handleRoomJoin(
  ws: WebSocket,
  clientId: string,
  payload: { code: string | null; name: string }
) {
  const { code, name } = payload

  const participant: Participant = {
    id: clientId,
    name,
    isDirector: !code, // creator becomes director
  }

  let room
  if (!code) {
    room = createRoom(participant)
  } else {
    room = joinRoom(code.toUpperCase(), participant)
    if (!room) {
      send(ws, 'error', { message: `Room ${code} not found` })
      return
    }
  }

  clientRooms.set(clientId, room.code)
  send(ws, 'room:state', { room, myId: clientId })
  broadcast(room.code, 'room:participants', { participants: room.participants }, clientId)
}

export function handleRoomLeave(ws: WebSocket, clientId: string) {
  const code = clientRooms.get(clientId)
  if (!code) return
  const room = leaveRoom(code, clientId)
  clientRooms.delete(clientId)
  if (room) {
    broadcast(room.code, 'room:participants', { participants: room.participants })
  }
}

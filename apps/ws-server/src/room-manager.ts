import { Room, Participant, Song } from '@christmas-carol/types'
import { v4 as uuidv4 } from 'uuid'

const rooms = new Map<string, Room>()

function generateCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `XMAS-${num}`
}

export function createRoom(director: Participant): Room {
  let code = generateCode()
  while (rooms.has(code)) code = generateCode()
  const room: Room = {
    code,
    participants: [director],
    songQueue: [],
    currentSong: null,
    createdAt: new Date(),
  }
  rooms.set(code, room)
  return room
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code)
}

export function joinRoom(code: string, participant: Participant): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  room.participants.push(participant)
  return room
}

export function leaveRoom(code: string, participantId: string): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  room.participants = room.participants.filter(p => p.id !== participantId)
  if (room.participants.length === 0) {
    rooms.delete(code)
    return null
  }
  // If director left, promote first participant
  const hasDirector = room.participants.some(p => p.isDirector)
  if (!hasDirector && room.participants.length > 0) {
    room.participants[0].isDirector = true
  }
  return room
}

export function addSong(code: string, song: Song): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  room.songQueue.push(song)
  return room
}

export function pickSong(code: string, songId: string): Room | null {
  const room = rooms.get(code)
  if (!room) return null
  const song = room.songQueue.find(s => s.id === songId)
  if (!song) return null
  room.currentSong = song
  room.songQueue = room.songQueue.filter(s => s.id !== songId)
  return room
}

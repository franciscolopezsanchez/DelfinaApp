export type Song = {
  id: string
  title: string
  artist: string
  lyrics: string       // plain text, verse/chorus blocks
  chords?: string      // optional chord chart
  addedBy: string
}

export type Participant = {
  id: string           // socket id
  name: string
  isDirector: boolean
}

export type Room = {
  code: string         // e.g. "XMAS-4821"
  participants: Participant[]
  songQueue: Song[]
  currentSong: Song | null
  createdAt: Date
}

// Server → Client events
export type ServerToClientEvents = {
  'room:state': { room: Room }
  'room:participants': { participants: Participant[] }
  'song:current': { song: Song | null }
  'song:queue': { queue: Song[] }
  'error': { message: string }
}

// Client → Server events
export type ClientToServerEvents = {
  'room:join': { code: string | null; name: string }
  'song:add': { song: Omit<Song, 'id' | 'addedBy'> }
  'song:pick': { songId: string }
  'room:leave': {}
}

export type WsMessage<T extends Record<string, unknown> = Record<string, unknown>> = {
  type: string
  payload: T
}

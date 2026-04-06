import http from 'http'
import WebSocket, { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import { handleRoomJoin, handleRoomLeave } from './handlers/room'
import { handleSongAdd, handleSongPick } from './handlers/songs'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000'

// Track client → room code
export const clientRooms = new Map<string, string>()
// Track clientId → WebSocket
export const clients = new Map<string, WebSocket>()

export function send(ws: WebSocket, type: string, payload: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }))
  }
}

export function broadcast(
  roomCode: string,
  type: string,
  payload: unknown,
  excludeId?: string
) {
  for (const [clientId, code] of clientRooms.entries()) {
    if (code !== roomCode) continue
    if (excludeId && clientId === excludeId) continue
    const ws = clients.get(clientId)
    if (ws) send(ws, type, payload)
  }
}

const server = http.createServer((_req, res) => {
  res.writeHead(200)
  res.end('Christmas Carol WS Server')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  const origin = req.headers.origin || ''
  if (origin && origin !== ALLOWED_ORIGIN) {
    ws.close(1008, 'Origin not allowed')
    return
  }

  const clientId = uuidv4()
  clients.set(clientId, ws)
  console.log(`[+] Client connected: ${clientId}`)

  ws.on('message', (raw) => {
    try {
      const { type, payload } = JSON.parse(raw.toString())
      switch (type) {
        case 'room:join':
          handleRoomJoin(ws, clientId, payload)
          break
        case 'room:leave':
          handleRoomLeave(ws, clientId)
          break
        case 'song:add':
          handleSongAdd(ws, clientId, payload.song)
          break
        case 'song:pick':
          handleSongPick(ws, clientId, payload)
          break
        default:
          console.warn(`Unknown message type: ${type}`)
      }
    } catch (err) {
      console.error('Failed to parse message:', err)
    }
  })

  ws.on('close', () => {
    console.log(`[-] Client disconnected: ${clientId}`)
    handleRoomLeave(ws, clientId)
    clients.delete(clientId)
  })
})

server.listen(PORT, () => {
  console.log(`WS server listening on port ${PORT}`)
  console.log(`Allowed origin: ${ALLOWED_ORIGIN}`)
})

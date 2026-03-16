'use client'
import { useEffect, useRef, useCallback, useState } from 'react'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

function getWsUrl() {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL
  if (typeof window === 'undefined') return 'ws://localhost:8080'
  const { hostname, protocol } = window.location
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
  return `${wsProtocol}//${hostname}:8080`
}
const WS_URL = getWsUrl()
const MAX_RETRIES = 5
const BASE_DELAY = 1000

export function useWebSocket(
  onMessage: (type: string, payload: unknown) => void
) {
  const wsRef = useRef<WebSocket | null>(null)
  const retriesRef = useRef(0)
  const onMessageRef = useRef(onMessage)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setStatus(retriesRef.current > 0 ? 'reconnecting' : 'connecting')
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      retriesRef.current = 0
      setStatus('connected')
    }

    ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data)
        onMessageRef.current(type, payload)
      } catch (e) {
        console.error('WS parse error', e)
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      if (retriesRef.current < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, retriesRef.current)
        retriesRef.current++
        setStatus('reconnecting')
        reconnectTimerRef.current = setTimeout(connect, delay)
      }
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current)
      wsRef.current?.close()
    }
  }, [connect])

  const send = useCallback((type: string, payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    }
  }, [])

  return { send, status }
}

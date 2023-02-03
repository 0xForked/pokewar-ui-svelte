export const WS_API_URL = "ws://localhost:8000/api/v1/ws"

export function InitWS(connId: string): WebSocket {
  return new WebSocket(`${WS_API_URL}/${connId}`)
}

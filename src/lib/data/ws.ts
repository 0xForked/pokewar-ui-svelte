export const WS_API_URL = "wss://pokewar.azurewebsites.net/api/v1/ws"

export function InitWS(connId: string): WebSocket {
  return new WebSocket(`${WS_API_URL}/${connId}`)
}

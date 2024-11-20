import type { Connection, ConnectionRequest } from './types'

export function getReactorKey(id: number) {
  return `reactor-node-${id}`
}

export function getReactorSocketKey(req: ConnectionRequest) {
  return `reactor-socket-${req.nodeId}-${req.socketId}-${req.socketType}`
}
export function getConnectionKey(connection: Connection) {
  return `${getReactorSocketKey(connection.source)}-${getReactorSocketKey(connection.target)}`
}

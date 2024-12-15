import type { ReactorEdge, ReactorSocket } from './types'

export function getReactorNodeKey(nodeId: string) {
  return `reactor-node-${nodeId}`
}

export function getReactorSocketKey({
  nodeId,
  socketType,
  socketId,
}: ReactorSocket) {
  return `reactor-socket-${nodeId}-${socketId}-${socketType}`
}
export function getReactorEdgeKey({ inlet, outlet }: ReactorEdge) {
  return `${getReactorSocketKey(inlet)}-${getReactorSocketKey(outlet)}`
}

export function compareSocket(a: ReactorSocket, b: ReactorSocket) {
  return (
    a.nodeId === b.nodeId &&
    a.socketId === b.socketId &&
    a.socketType === b.socketType
  )
}

import type { ReactorEdge, ReactorSocket } from './types'

export function getReactorNodeKey(nodeId: number) {
  return `reactor-node-${nodeId}`
}

export function getReactorSocketKey({
  nodeId,
  socketType,
  socketId,
}: ReactorSocket) {
  return `reactor-socket-${nodeId}-${socketId}-${socketType}`
}
export function getReactorEdgeKey({ source, target }: ReactorEdge) {
  return `${getReactorSocketKey(source)}-${getReactorSocketKey(target)}`
}

export function compareSocket(a: ReactorSocket, b: ReactorSocket) {
  return (
    a.nodeId === b.nodeId &&
    a.socketId === b.socketId &&
    a.socketType === b.socketType
  )
}

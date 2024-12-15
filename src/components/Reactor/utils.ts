import { DirectedGraph } from '@src/logic/shared/graph'
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

export function getHyperReactorInnerSocketKey({
  nodeId,
  socketType,
}: Omit<ReactorSocket, 'socketId'>) {
  return `inner-socket-${nodeId}-${socketType}`
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

export function createInitialGraph(parentId: string = 'root') {
  const graph = new DirectedGraph<string, ReactorEdge>()

  graph.addNode(
    getHyperReactorInnerSocketKey({
      nodeId: parentId,
      socketType: 'input',
    }),
  )
  graph.addNode(
    getHyperReactorInnerSocketKey({
      nodeId: parentId,
      socketType: 'output',
    }),
  )

  return graph
}

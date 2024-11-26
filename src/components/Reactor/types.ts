import type { DirectedGraph } from '@src/logic/shared/graph'

export type ReactorNode = {
  nodeId: number
  x: number
  y: number
  w?: number
  h?: number
  parentId?: number
  isHyper?: boolean
}

export type ReactorSocket = {
  nodeId: number
  socketType: 'input' | 'output'
  socketId: number
}

export type ReactorEdge = {
  inlet: ReactorSocket & { socketType: 'input' }
  outlet: ReactorSocket & { socketType: 'output' }
  parentId?: number
}

export type ReactorGraph = DirectedGraph<number, ReactorEdge>

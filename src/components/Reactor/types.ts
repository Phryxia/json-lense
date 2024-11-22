import type { DirectedGraph } from '@src/logic/shared/graph'

export type Dimension = {
  x: number
  y: number
  w?: number
  h?: number
}

export type ReactorSocket = {
  nodeId: number
  socketType: 'input' | 'output'
  socketId: number
}

export type ReactorEdge = {
  inlet: ReactorSocket & { socketType: 'input' }
  outlet: ReactorSocket & { socketType: 'output' }
}

export type ReactorGraph = DirectedGraph<number, ReactorEdge>

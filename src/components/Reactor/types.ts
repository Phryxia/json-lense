import type { DirectedGraph } from '@src/logic/shared/graph'

export type ReactorNode = {
  nodeId: string
  parentId?: string
  isHyper?: boolean
  x: number
  y: number
}

export type ReactorSocket = {
  nodeId: string
  socketType: 'input' | 'output'
  socketId: number
}

export type ReactorEdge = {
  inlet: ReactorSocket & { socketType: 'input' }
  outlet: ReactorSocket & { socketType: 'output' }
  parentId?: string
}

export type ReactorGraph = DirectedGraph<number, ReactorEdge>

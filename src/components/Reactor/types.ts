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
  source: ReactorSocket
  target: ReactorSocket
}

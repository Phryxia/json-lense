export type Dimension = {
  x: number
  y: number
  w?: number
  h?: number
}

export type ConnectionRequest = {
  nodeId: number
  socketType: 'input' | 'output'
  socketId: number
}

export type Connection = {
  source: ConnectionRequest
  target: ConnectionRequest
}

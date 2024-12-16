import type { Molecule } from './molecule'
import type { Serializable } from './serializable'

export interface Reactor {
  name: string
  readonly meta: ReactorNodeMeta
  run(molecules: Molecule[]): Molecule[]
}

export interface ReactorNode {
  id: string
  sources: { id: string; socketId: number }[]
  reactor: Reactor
}

export interface ReactorNodeMeta {
  inlets: number
  outlets: number
}

export type SerializedReactor<Schema extends Serializable> = {
  id: string
  name: string
  data: Schema
}

export type ReactorCreator<Schema extends Serializable> = (
  s: SerializedReactor<Schema>,
) => Reactor

export interface ReactorEdge {
  sourceId: string
  sourceSocketId: number
  targetId: string
}

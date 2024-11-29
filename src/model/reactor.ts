import type { Molecule } from './molecule'
import type { Serializable } from './serializable'

export interface Reactor {
  name: string
  run(molecules: Molecule[]): Molecule[]
}

export interface ReactorNode {
  id: number
  sources: number[]
  reactor: Reactor
}

export type SerializedReactor<Schema extends Serializable> = {
  id: number
  name: string
  data: Schema
}

export type ReactorCreator<Schema extends Serializable> = (
  s: SerializedReactor<Schema>,
) => Reactor

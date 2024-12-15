import type { Molecule } from './molecule'
import type { Serializable } from './serializable'

export interface Reactor {
  name: string
  run(molecules: Molecule[]): Molecule[]
}

export interface ReactorNode {
  id: string
  sources: number[]
  reactor: Reactor
}

export type SerializedReactor<Schema extends Serializable> = {
  id: string
  name: string
  data: Schema
}

export type ReactorCreator<Schema extends Serializable> = (
  s: SerializedReactor<Schema>,
) => Reactor

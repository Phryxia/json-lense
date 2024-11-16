import type { Molecule } from './molecule'

export interface Reactor {
  name: string
  run(molecules: Molecule[]): Molecule[]
}

export interface ReactorNode {
  id: number
  sources: number[]
  reactor: Reactor
}

export type SerializedReactor = {
  name: string
  data: any
}

export type ReactorCreator<Schema extends SerializedReactor> = (
  s: Schema,
) => Reactor

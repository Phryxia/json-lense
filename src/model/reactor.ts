import type { Molecule } from './molecule'

export interface Reactor {
  name: string
  run(molecules: Molecule[]): Molecule[]
  serializer: ReactSerializer<Reactor>
}

export interface ReactorNode {
  id: number
  sources: number[]
  reactor: Reactor
}

export interface ReactorCluster {
  nodes: ReactorNode[]
}

export interface ReactSerializer<T extends Reactor> {
  parse(s: string): T
  stringify(): string
}

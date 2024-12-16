import { Molecule } from '@src/model/molecule'

export interface JSONLense {
  nodeId: string
  run(molecule: Molecule): Molecule[]
}

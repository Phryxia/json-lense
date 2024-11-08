export type MoleculeType =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'string'
  | 'number'
  | { [K in string]: MoleculeType }
  | MoleculeType[]

export type Molecule =
  | {
      value:
        | undefined
        | null
        | boolean
        | string
        | number
        | { [K in string]: Molecule }
        | Molecule[]
      type: MoleculeType
      error?: false
      reason?: undefined
    }
  | {
      value?: undefined
      type?: undefined
      error: true
      reason?: string
    }

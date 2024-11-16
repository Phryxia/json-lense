export type MoleculeType =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'string'
  | 'number'
  | 'error'
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
      type: Exclude<MoleculeType, 'error'>
      error?: false
      reason?: undefined
    }
  | {
      value?: undefined
      type: 'error'
      error: true
      reason?: string
    }

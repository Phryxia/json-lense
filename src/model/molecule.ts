export type MoleculeType =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'string'
  | 'number'
  | 'error'
  | { [K in string]: MoleculeType }
  | MoleculeType[]

export type Molecule = PrimitiveMolecule | NonPrimitiveMolecule | ErrorMolecule

export type ErrorMolecule = {
  value?: undefined
  type: 'error'
  reason?: string
}

export type NonErrorMolecule = {
  reason?: undefined
}

export type PrimitiveMolecule =
  | UndefinedMolecule
  | NullMolecule
  | BooleanMolecule
  | StringMolecule
  | NumberMolecule

export type NonPrimitiveMolecule = ArrayMolecule | ObjectMolecule

export type UndefinedMolecule = NonErrorMolecule & {
  value: undefined
  type: 'undefined'
}

export type NullMolecule = NonErrorMolecule & {
  value: null
  type: 'null'
}

export type BooleanMolecule = NonErrorMolecule & {
  value: boolean
  type: 'boolean'
}

export type StringMolecule = NonErrorMolecule & {
  value: string
  type: 'string'
}

export type NumberMolecule = NonErrorMolecule & {
  value: number
  type: 'number'
}

export type ArrayMolecule = NonErrorMolecule & {
  value: Molecule[]
  type: MoleculeType[]
}

export type ObjectMolecule = NonErrorMolecule & {
  value: { [K in string]: Molecule }
  type: { [K in string]: MoleculeType }
}

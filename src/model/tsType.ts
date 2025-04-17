export type PrimitiveType =
  | 'boolean'
  | 'number'
  | 'string'
  | 'null'
  | 'undefined'

export type ArrayTsType = TsType[]

export type TsType = PrimitiveType | ArrayTsType | ObjectTsType | UnionTsType

export type ObjectTsType = {
  [key: string]: ObjectProperty
}

export interface ObjectProperty {
  meta: 'object'
  isOptional?: boolean
  type: TsType
}

export interface UnionTsType {
  meta: 'union'
  types: TsType[]
}

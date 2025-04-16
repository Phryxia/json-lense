export type PrimitiveType =
  | 'boolean'
  | 'number'
  | 'string'
  | 'null'
  | 'undefined'

export type ArrayTsType = TsType[]

export type TsType = PrimitiveType | ArrayTsType | ObjectTsType

export type ObjectTsType = {
  [key: string]: ObjectProperty
}

export interface ObjectProperty {
  isOptional?: boolean
  type: TsType
}

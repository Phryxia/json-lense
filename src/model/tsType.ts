export type PrimitiveType =
  | 'boolean'
  | 'number'
  | 'string'
  | 'null'
  | 'undefined'

export type ArrayTsType = TsType[]

export type ObjectTsType = { [key: string]: TsType }

export type TsType = PrimitiveType | ArrayTsType | ObjectTsType

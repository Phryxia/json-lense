import type {
  ArrayTsType,
  ObjectTsType,
  PrimitiveType,
  TsType,
  UnionTsType,
} from '@src/model/tsType'

export function isPrimitiveType(tsType: TsType): tsType is PrimitiveType {
  return (
    tsType === 'boolean' ||
    tsType === 'number' ||
    tsType === 'string' ||
    tsType === 'null' ||
    tsType === 'undefined'
  )
}

export function isArrayTsType(tsType: TsType): tsType is ArrayTsType {
  return Array.isArray(tsType)
}

export function isObjectTsType(tsType: TsType): tsType is ObjectTsType {
  return (
    typeof tsType === 'object' &&
    tsType &&
    !isArrayTsType(tsType) &&
    !isUnionTsType(tsType)
  )
}

export function isUnionTsType(tsType: TsType): tsType is UnionTsType {
  return (tsType as any)?.meta === 'union'
}

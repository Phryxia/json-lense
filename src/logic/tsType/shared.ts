import type {
  ArrayTsType,
  ObjectTsType,
  PrimitiveType,
  TsType,
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
  return typeof tsType === 'object' && !!tsType && !Array.isArray(tsType)
}

import type { TsType } from '@src/model/tsType'
import { isPrimitiveType } from './shared'

export function extractTsType(value: any): TsType {
  if (value === null) {
    return 'null'
  }

  // BigInt won't be here
  const typeOfValue = typeof value as TsType

  if (isPrimitiveType(typeOfValue)) {
    return typeOfValue
  }

  if (Array.isArray(value)) {
    return value.map(extractTsType)
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, childValue]) => [
        key,
        {
          meta: 'object',
          type: extractTsType(childValue),
        },
      ]),
    )
  }

  throw new Error(`Unsupported type: ${typeof value}`)
}

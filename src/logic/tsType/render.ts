import { fx } from '@fxts/core'
import type { TsType } from '@src/model/tsType'
import {
  isArrayTsType,
  isObjectTsType,
  isPrimitiveType,
  isUnionTsType,
} from './shared'

export function renderTsType(tsType: TsType) {
  return `type Type = ${renderTsTypeRecurse(tsType)}`
}

function renderTsTypeRecurse(tsType: TsType): string {
  if (isPrimitiveType(tsType)) {
    return tsType as string
  }

  if (isArrayTsType(tsType)) {
    const childrenTypes = tsType.map((childType) =>
      renderTsTypeRecurse(childType),
    )
    return `[${childrenTypes.join(', ')}]`
  }

  if (isObjectTsType(tsType)) {
    const optionalities = Object.values(tsType).map(
      ({ isOptional }) => isOptional,
    )
    const childrenTypes = Object.values(tsType).map((childType) =>
      renderTsTypeRecurse(childType.type),
    )
    return `{ ${Object.keys(tsType)
      .map(
        (key, index) =>
          `${key}${optionalities[index] ? '?' : ''}: ${childrenTypes[index]};`,
      )
      .join(' ')} }`
  }

  if (isUnionTsType(tsType)) {
    const childrenTypes = new Set(tsType.types.map(renderTsTypeRecurse))
    return `${fx(childrenTypes.values()).join(' | ')}`
  }

  throw new Error(`Unsupported type: ${JSON.stringify(tsType)}`)
}

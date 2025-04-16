import { TsType } from '@src/model/tsType'
import { isArrayTsType, isPrimitiveType } from './shared'

export interface RenderedType {
  typeName: string
  ts: string
}

export function renderTsType(
  tsType: TsType,
  results: RenderedType[],
  path: string[] = [],
): RenderedType {
  const typeName = `Type${path.length ? `_${path.join('_')}` : ''}`
  const prefix = `type ${typeName} = `

  if (isPrimitiveType(tsType)) {
    const result = { typeName, ts: `${prefix}${tsType}` }
    results.push(result)
    return result
  }

  if (isArrayTsType(tsType)) {
    const childrenTypes = tsType.map((childType, index) =>
      renderTsType(childType, results, [...path, index.toString()]),
    )
    const ts = `${prefix}[${childrenTypes.map(({ typeName }) => typeName).join(', ')}]`
    const result = { typeName, ts }
    results.push(result)
    return result
  }

  const optionalities = Object.values(tsType).map(
    ({ isOptional }) => isOptional,
  )
  const childrenTypes = Object.entries(tsType).map(([key, childType]) =>
    renderTsType(childType.type, results, [...path, key]),
  )
  const ts = `${prefix}{ ${Object.keys(tsType)
    .map(
      (key, index) =>
        `${key}${optionalities[index] ? '?' : ''}: ${childrenTypes[index].typeName};`,
    )
    .join(' ')} }`
  const result = { typeName, ts }
  results.push(result)
  return result
}

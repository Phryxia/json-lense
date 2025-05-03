import { useLayoutEffect, useMemo } from 'react'
import * as monaco from 'monaco-editor'
import { renderTsType } from './tsType/render'
import { extractTsType } from './tsType/extract'

const ROOT_FUNCTION_TYPE = `
type PrimitiveOrArrayOrObject = undefined | null | boolean | number | string | PrimitiveOrArrayOrObject[] | { [K in string]: PrimitiveOrArrayOrObject };
type ValidReactor = (data: Type) => PrimitiveOrArrayOrObject`

export function useUpdateMonacoTsTypes(json: any) {
  const renderedTypes = useMemo(() => renderFinalType(json), [json])

  useLayoutEffect(() => {
    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      {
        content: renderedTypes,
      },
    ])
  }, [renderedTypes])

  return renderedTypes
}

function renderFinalType(json: any) {
  if (json === undefined) {
    return 'type Type = undefined' + ROOT_FUNCTION_TYPE
  }
  return renderTsType(extractTsType(json)) + ROOT_FUNCTION_TYPE
}

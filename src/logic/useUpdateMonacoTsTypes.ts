import { useLayoutEffect } from 'react'
import * as monaco from 'monaco-editor'
import { renderTsType } from './tsType/render'
import { extractTsType } from './tsType/extract'

const ROOT_FUNCTION_TYPE = `
type PrimitiveOrArrayOrObject = undefined | null | boolean | number | string | PrimitiveOrArrayOrObject[] | { [K in string]: PrimitiveOrArrayOrObject };
type ValidReactor = (data: Type) => PrimitiveOrArrayOrObject`

export function useUpdateMonacoTsTypes(json: any) {
  useLayoutEffect(() => {
    if (json === undefined) {
      monaco.languages.typescript.typescriptDefaults.setExtraLibs([
        {
          content: 'type Type = undefined' + ROOT_FUNCTION_TYPE,
        },
      ])
      return
    }

    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      {
        content: renderTsType(extractTsType(json)) + ROOT_FUNCTION_TYPE,
      },
    ])
  }, [json])
}

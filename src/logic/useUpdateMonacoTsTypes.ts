import { useLayoutEffect } from 'react'
import * as monaco from 'monaco-editor'
import { renderTsType, type RenderedType } from './tsType/render'
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

    const renderedTypes: RenderedType[] = []
    renderTsType(extractTsType(json), renderedTypes)

    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      {
        content:
          renderedTypes.map(({ ts }) => ts).join('\n') + ROOT_FUNCTION_TYPE,
      },
    ])
  }, [json])
}

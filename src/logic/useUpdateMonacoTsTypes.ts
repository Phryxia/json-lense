import { useLayoutEffect } from 'react'
import * as monaco from 'monaco-editor'
import { renderTsType, type RenderedType } from './tsType/render'
import { extractTsType } from './tsType/extract'

export function useUpdateMonacoTsTypes(json: any) {
  useLayoutEffect(() => {
    if (json === undefined) {
      monaco.languages.typescript.typescriptDefaults.setExtraLibs([
        {
          content: 'type Type = undefined',
        },
      ])
      return
    }

    const renderedTypes: RenderedType[] = []
    renderTsType(extractTsType(json), renderedTypes)

    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      {
        content: renderedTypes.map(({ ts }) => ts).join('\n'),
      },
    ])
  }, [json])
}

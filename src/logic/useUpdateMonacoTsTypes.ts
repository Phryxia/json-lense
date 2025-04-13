import { useLayoutEffect, useState } from 'react'
import * as monaco from 'monaco-editor'
import { renderTsType, type RenderedType } from './tsType/render'
import { extractTsType } from './tsType/extract'

export function useUpdateMonacoTsTypes(json: any) {
  const [renderedTypes, setRenderedTypes] = useState<RenderedType[]>([])

  useLayoutEffect(() => {
    if (json === undefined) {
      setRenderedTypes([])
      return
    }

    const results: RenderedType[] = []
    renderTsType(extractTsType(json), results)
    setRenderedTypes(results)
  }, [json])

  useLayoutEffect(() => {
    const joinedTypes = renderedTypes.map(({ ts }) => ts).join('\n')

    monaco.languages.typescript.typescriptDefaults.setExtraLibs([
      {
        content: joinedTypes,
      },
    ])
  }, [renderedTypes])
}

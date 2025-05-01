import * as monaco from 'monaco-editor'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { debounce } from '@src/logic/shared/debounce'
import { useTunnel } from '@src/logic/shared/useTunnel'
import { escapeForTypeScript } from '@src/logic/tsType/escape'
import type { JsWorkerProtocol, JsWorkerSuccess } from './types'
import { JsWorkerMessageType } from './consts'
import { useJsWorker } from './useJsWorker'

export function useProessJson({
  editor,
  json,
  onSuccess,
}: {
  editor: monaco.editor.IStandaloneCodeEditor | null
  json: any
  onSuccess(data: JsWorkerSuccess): void
}) {
  const [jsError, setJsError] = useState('')
  const jsWorker = useJsWorker()
  const processJson = useMemo(
    () => createJsProcessor(editor?.getModel()),
    [editor],
  )
  const playground = useTunnel({
    json,
    processJson,
    async handleProcessJson() {
      const js = await this.processJson?.(this.json)

      if (!js) return

      jsWorker.setScript(js)
    },
  })

  useLayoutEffect(() => {
    playground.current.handleProcessJson()
  }, [json])

  useLayoutEffect(() => {
    editor?.onDidChangeModelContent((e) => {
      if (e.isEolChange) return
      playground.current.handleProcessJson()
    })

    return () => jsWorker.terminate()
  }, [editor, jsWorker])

  const handleJsProcess = useCallback(
    (data: JsWorkerProtocol) => {
      if (data.type === JsWorkerMessageType.TransformResult) {
        onSuccess(data.result)
        setJsError('')
      } else {
        setJsError(data.error.toString())
      }
    },
    [onSuccess],
  )

  useLayoutEffect(() => {
    jsWorker.addEventListener(handleJsProcess)

    return () => jsWorker.removeEventListener(handleJsProcess)
  }, [jsWorker, handleJsProcess])

  return {
    jsError,
  }
}

function createJsProcessor(model: monaco.editor.ITextModel | null | undefined) {
  if (!model) return () => Promise.resolve('')

  return debounce(async (targetValue: any) => {
    const tsWorker = await monaco.languages.typescript.getTypeScriptWorker()
    const client = await tsWorker(model.uri)
    const result = await client.getEmitOutput(model.uri.toString())
    const js = `${result.outputFiles[0].text}
  try {
    self.postMessage({
      type: '${JsWorkerMessageType.TransformResult}',
      result: transform(${
        typeof targetValue === 'object'
          ? `JSON.parse('${escapeForTypeScript(JSON.stringify(targetValue))}')`
          : renderPrimitiveValue(targetValue)
      })
    })
  } catch (error) {
    self.postMessage({
      type: '${JsWorkerMessageType.TransformError}',
      error
    })
  }`
    return js
  }, 1000)
}

function renderPrimitiveValue(value: any) {
  if (value === null) {
    return 'null'
  }

  if (value === undefined) {
    return 'undefined'
  }

  if (typeof value === 'string') {
    return `'${escapeForTypeScript(value)}'`
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value.toString()
  }

  throw new Error(`Unsupported type: ${typeof value}`)
}

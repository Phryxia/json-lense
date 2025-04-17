import classNames from 'classnames/bind'
import styles from './ReactorEditor.module.css'
import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { JsWorkerSuccess } from './types'
import { useProessJson } from './useProcessJson'

const cx = classNames.bind(styles)

const DEFAULT_CODE = `// Do not change or remove this signature!
const transform: ValidReactor = (data: Type) => {
  return data
}`

interface Props {
  json: any | undefined
  onSuccess(data: JsWorkerSuccess): void
}

export function ReactorEditor({ json, onSuccess }: Props) {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoDOM = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (monacoDOM) {
      setEditor((editor) => {
        if (editor) return editor

        return monaco.editor.create(monacoDOM.current!, {
          value: DEFAULT_CODE,
          language: 'typescript',
        })
      })
    }

    return () => editor?.dispose()
  }, [monacoDOM.current])

  const { jsError } = useProessJson({
    json,
    editor,
    onSuccess,
  })

  return (
    <article>
      <div className={cx('root')} ref={monacoDOM}></div>
      {jsError && (
        <pre>
          <code>{jsError}</code>
        </pre>
      )}
    </article>
  )
}

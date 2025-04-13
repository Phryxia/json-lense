import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import styles from './ReactorEditor.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const DEFAULT_CODE = `// Do not remove \`Type\` keyword!!!
function transform(data: Type) {
  return data
}`

export function ReactorEditor() {
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

  return (
    <article>
      <div className={cx('root')} ref={monacoDOM}></div>
    </article>
  )
}

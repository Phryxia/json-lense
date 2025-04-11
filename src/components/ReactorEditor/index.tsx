import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import styles from './ReactorEditor.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export function ReactorEditor() {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoDOM = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (monacoDOM) {
      setEditor((editor) => {
        if (editor) return editor

        return monaco.editor.create(monacoDOM.current!, {
          value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
            '\n',
          ),
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

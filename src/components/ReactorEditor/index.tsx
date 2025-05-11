import classNames from 'classnames/bind'
import styles from './ReactorEditor.module.css'
import { useCallback, useRef } from 'react'
import { useUpdateMonacoTsTypes } from '@src/logic/useUpdateMonacoTsTypes'
import { createEditor, getEditor } from '@src/logic/monaco/getEditor'
import type { JsWorkerSuccess } from './types'
import { useProessJson } from './useProcessJson'

const cx = classNames.bind(styles)

const DEFAULT_CODE = `// Do not change or remove this signature!
const transform: ValidReactor = (data: Type) => {
  return data
}`

interface Props {
  name: string
  json: any | undefined
  onSuccess(data: JsWorkerSuccess): void
}

export function ReactorEditor({ name, json, onSuccess }: Props) {
  useUpdateMonacoTsTypes(json)

  const { jsError } = useProessJson({
    editorName: name,
    json,
    onSuccess,
  })

  const resizeObserver = useRef<ResizeObserver>()

  /**
   * Connect VDOM with monaco editor states
   *
   * @param monacoDOM Monaco editor DOM element
   */
  const handleContainerInitialized = useCallback(
    (monacoDOM: HTMLDivElement | null) => {
      // In react dev mode, this function may be called multiple times.
      // To guard duplicated model and editor creation, I have to clean up properly.
      if (monacoDOM) {
        const editor = createEditor(name, monacoDOM, DEFAULT_CODE)
        resizeObserver.current = new ResizeObserver(() => editor.layout())
        resizeObserver.current.observe(monacoDOM)
      } else {
        resizeObserver.current?.disconnect()
        getEditor(name)?.dispose()
      }
    },
    [name],
  )

  return (
    <article className={cx('root')}>
      <div
        key={name}
        className={cx('container')}
        ref={handleContainerInitialized}
      />
      {jsError && (
        <pre>
          <code>{jsError}</code>
        </pre>
      )}
    </article>
  )
}

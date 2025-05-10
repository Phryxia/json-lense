import classNames from 'classnames/bind'
import styles from './ReactorEditor.module.css'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { useUpdateMonacoTsTypes } from '@src/logic/useUpdateMonacoTsTypes'
import { useMonaco } from '../MonacoContext'
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
  const [editor, setEditor] = useMonaco(name)

  useUpdateMonacoTsTypes(json)

  const { jsError } = useProessJson({
    json,
    editor,
    onSuccess,
  })

  /**
   * Connect VDOM with monaco editor states
   *
   * @param monacoDOM Monaco editor DOM element
   */
  function handleContainerInitialized(monacoDOM: HTMLDivElement | null) {
    if (!editor && monacoDOM) {
      setEditor(
        monaco.editor.create(monacoDOM, {
          model: monaco.editor.createModel(DEFAULT_CODE, 'typescript'),
        }),
      )
    } else if (editor && !monacoDOM) {
      editor.dispose()
      setEditor(undefined)
    }
  }

  return (
    <article>
      <div key={name} className={cx('root')} ref={handleContainerInitialized} />
      {jsError && (
        <pre>
          <code>{jsError}</code>
        </pre>
      )}
    </article>
  )
}

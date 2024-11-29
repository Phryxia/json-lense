import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { ReactorVisualProvider, useReactorVisual } from './ReactorVisualContext'
import { ReactorPlayground } from './ReactorPlayground'
import { useReactor } from './model/ReactorModelContext'
import { ReactorName } from '@src/logic/reactor/consts'

const cx = cnx.bind(styles)

export function ReactorEditor() {
  return (
    <ReactorVisualProvider>
      <ReactorEditorContents />
    </ReactorVisualProvider>
  )
}

function ReactorEditorContents() {
  const { add } = useReactor()
  const { nodeEditor } = useReactorVisual()

  return (
    <article className={cx('root')}>
      <button
        onClick={() => {
          const nodeId = add({
            name: ReactorName.Pick,
            data: [],
          })
          nodeEditor.add({
            nodeId,
            x: 10,
            y: 10,
          })
        }}
      >
        ADD
      </button>

      {/* <button
        onClick={() => {
          nodeEditor.add({
            x: 10,
            y: 10,
            isHyper: true,
          })
        }}
      >
        ADD HYPER
      </button> */}
      <ReactorPlayground isRoot />
    </article>
  )
}

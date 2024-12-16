import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import {
  ReactorVisualProvider,
  useReactorVisual,
} from '@src/components/Reactor/visual/ReactorVisualContext'
import { ReactorPlayground } from './ReactorPlayground'

const cx = cnx.bind(styles)

export function ReactorEditor() {
  return (
    <ReactorVisualProvider>
      <ReactorEditorContents />
    </ReactorVisualProvider>
  )
}

function ReactorEditorContents() {
  const { createNode } = useReactorVisual()

  return (
    <article className={cx('root')}>
      <button onClick={() => createNode()}>ADD</button>

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

import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import {
  ReactorVisualProvider,
  useReactorVisual,
} from './visual/ReactorVisualContext'
import { ReactorPlayground } from './ReactorPlayground'
import { useReactor } from './model/ReactorModelContext'
import { ReactorName } from '@src/logic/reactor/consts'
import { useCallback } from 'react'

const cx = cnx.bind(styles)

export function ReactorEditor() {
  const { add } = useReactor()

  const createNode = useCallback(() => {
    const nodeId = add({
      name: ReactorName.Pick,
      data: [],
    })
    return nodeId
  }, [add])

  return (
    <ReactorVisualProvider onCreation={createNode}>
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

import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react'
import { checkOutsideMouseEvent } from '@src/logic/shared/checkOutsideMouseEvent'
import { ReactorVisualProvider, useReactorVisual } from './ReactorVisualContext'
import { getReactorEdgeKey } from './utils'
import { ReactorNodeView } from './ReactorNodeView'
import { ReactorEdgeView } from './ReactorEdgeView'
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
  const { nodeEditor } = useReactorVisual()

  return (
    <article className={cx('root')}>
      <button
        onClick={() => {
          nodeEditor.add({
            x: 10,
            y: 10,
          })
        }}
      >
        ADD
      </button>
      <ReactorPlayground isRoot />
    </article>
  )
}

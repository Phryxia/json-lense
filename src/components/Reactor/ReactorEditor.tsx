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

const cx = cnx.bind(styles)

export function ReactorEditor() {
  return (
    <ReactorVisualProvider>
      <ReactorEditorContents />
    </ReactorVisualProvider>
  )
}

function ReactorEditorContents() {
  const { nodeEditor, edgeEditor, mouse } = useReactorVisual()
  const draggingNodeId = useRef(-1)

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLElement>, id: number) => {
      e.stopPropagation()
      draggingNodeId.current = id
    },
    [],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      draggingNodeId.current = -1

      if (
        edgeEditor.reservedSocket &&
        checkOutsideMouseEvent(e, (dom) => dom.id.includes('socket'))
      ) {
        edgeEditor.cancelConnection()
      }
    },
    [edgeEditor.reservedSocket],
  )

  useLayoutEffect(() => {
    addEventListener('mouseup', handleMouseUp)
    return () => removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    if (draggingNodeId.current === -1) return

    const rootBound = e.currentTarget.getBoundingClientRect()

    if (
      rootBound.left >= e.pageX ||
      rootBound.right <= e.pageX ||
      rootBound.top >= e.pageY ||
      rootBound.bottom <= e.pageY
    ) {
      draggingNodeId.current = -1
      return
    }

    nodeEditor.modify(draggingNodeId.current, ({ x, y }) => ({
      x: x + e.movementX,
      y: y + e.movementY,
    }))
  }, [])

  return (
    <article
      ref={mouse.editorRef}
      className={cx('root')}
      onMouseMove={handleMouseMove}
    >
      <svg className={cx('edges')}>
        {/* Defined edges */}
        {edgeEditor.edges.map((edge) => (
          <ReactorEdgeView edge={edge} key={getReactorEdgeKey(edge)} />
        ))}

        {/* Current working edge */}
        {edgeEditor.reservedSocket && (
          <ReactorEdgeView
            edge={{
              [edgeEditor.reservedSocket.socketType === 'input'
                ? 'inlet'
                : 'outlet']: edgeEditor.reservedSocket,
            }}
          />
        )}
      </svg>

      {nodeEditor.nodes.map((_, nodeId) => (
        <ReactorNodeView
          id={nodeId}
          key={nodeId}
          name="test"
          handleMouseDown={(e) => handleMouseDown(e, nodeId)}
          inputParams={['a', 'b', 'c']}
          outputParams={['d', 'e']}
        />
      ))}

      <div className={cx('ui')}>
        <button
          onClick={() =>
            nodeEditor.add({
              x: Math.random() * 100,
              y: Math.random() * 100,
            })
          }
        >
          ADD
        </button>
      </div>
    </article>
  )
}

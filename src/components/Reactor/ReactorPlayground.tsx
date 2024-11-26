import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useLayoutEffect,
} from 'react'
import { checkOutsideMouseEvent } from '@src/logic/shared/checkOutsideMouseEvent'
import { useReactorVisual } from './ReactorVisualContext'
import { getReactorEdgeKey } from './utils'
import { ReactorNodeView } from './ReactorNodeView'
import { ReactorEdgeView } from './ReactorEdgeView'

const cx = cnx.bind(styles)

type Props = {
  id?: number
  isRoot?: boolean
}

export function ReactorPlayground({ id, isRoot }: Props) {
  const { nodeEditor, edgeEditor, mouse, draggingNodeId } = useReactorVisual()

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
      ref={isRoot ? mouse.editorRef : undefined}
      className={cx('editor')}
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

      {nodeEditor.nodes
        .filter((node) => node.parentId === id)
        .map((_, nodeId) => (
          <ReactorNodeView
            id={nodeId}
            key={nodeId}
            name="test"
            inputParams={['a', 'b', 'c']}
            outputParams={['d', 'e']}
          />
        ))}
    </article>
  )
}

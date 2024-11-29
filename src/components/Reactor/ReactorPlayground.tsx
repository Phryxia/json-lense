import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { MouseEvent, useCallback } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import { getReactorEdgeKey } from './utils'
import { ReactorNodeView } from './ReactorNodeView'
import { ReactorEdgeView } from './ReactorEdgeView'
import { HyperReactorNodeView } from './HyperReactorNodeView'
import { useMouse } from './useMouse'
import { useReactor } from './model/ReactorModelContext'
import { getReactorSockets, ReactorModule } from './modules'
import { ReactorName } from '@src/logic/reactor/consts'

const cx = cnx.bind(styles)

type Props = {
  id?: number
  isRoot?: boolean
}

export function ReactorPlayground({ id, isRoot }: Props) {
  const { schemas, update } = useReactor()
  const { nodeEditor, edgeEditor, draggingNodeId } = useReactorVisual()
  const { playgroundRef, ...fallback } = useMouse()

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
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
      ref={playgroundRef}
      className={cx('editor')}
      onMouseMove={isRoot ? handleMouseMove : undefined}
    >
      <svg className={cx('edges')}>
        {/* Defined edges */}
        {edgeEditor.edges
          .filter((edge) => edge.parentId === id)
          .map((edge) => (
            <ReactorEdgeView edge={edge} key={getReactorEdgeKey(edge)} />
          ))}

        {/* Current working edge */}
        {edgeEditor.reservedSocket &&
          nodeEditor.nodes[edgeEditor.reservedSocket.nodeId].parentId ===
            id && (
            <ReactorEdgeView
              edge={{
                [edgeEditor.reservedSocket.socketType === 'input'
                  ? 'inlet'
                  : 'outlet']: edgeEditor.reservedSocket,
                parentId: id,
              }}
              fallback={fallback}
            />
          )}
      </svg>

      {nodeEditor.nodes
        .filter((node) => node.parentId === id)
        .map(({ isHyper, nodeId }) =>
          isHyper ? (
            <HyperReactorNodeView
              id={nodeId}
              key={nodeId}
              name="hyper"
              inputParams={['x']}
              outputParams={['y']}
            >
              <ReactorModule reactor={schemas[nodeId]} onChange={update} />
            </HyperReactorNodeView>
          ) : (
            <ReactorNodeView
              id={nodeId}
              key={nodeId}
              name={schemas[nodeId].name}
              {...getReactorSockets(schemas[nodeId].name as ReactorName)}
            >
              <ReactorModule reactor={schemas[nodeId]} onChange={update} />
            </ReactorNodeView>
          ),
        )}
    </article>
  )
}

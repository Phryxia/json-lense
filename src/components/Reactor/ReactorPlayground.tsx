import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { MouseEvent, useCallback } from 'react'
import { useReactorVisual } from './visual/ReactorVisualContext'
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
  id?: string
  isRoot?: boolean
}

export function ReactorPlayground({ id, isRoot }: Props) {
  const { schemas, update } = useReactor()
  const { nodes, edges, updateNode, reservedSocket, draggingNodeId } =
    useReactorVisual()
  const { playgroundRef, ...fallback } = useMouse()

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!draggingNodeId.current) return

      const rootBound = e.currentTarget.getBoundingClientRect()

      if (
        rootBound.left >= e.pageX ||
        rootBound.right <= e.pageX ||
        rootBound.top >= e.pageY ||
        rootBound.bottom <= e.pageY
      ) {
        draggingNodeId.current = ''
        return
      }

      updateNode(draggingNodeId.current, ({ x, y }) => ({
        x: x + e.movementX,
        y: y + e.movementY,
      }))
    },
    [updateNode],
  )

  return (
    <article
      ref={playgroundRef}
      className={cx('editor')}
      onMouseMove={isRoot ? handleMouseMove : undefined}
    >
      <svg className={cx('edges')}>
        {/* Defined edges */}
        {edges
          .filter((edge) => edge.parentId === id)
          .map((edge) => (
            <ReactorEdgeView edge={edge} key={getReactorEdgeKey(edge)} />
          ))}

        {/* Current working edge */}
        {reservedSocket && nodes[reservedSocket.nodeId].parentId === id && (
          <ReactorEdgeView
            edge={{
              [reservedSocket.socketType === 'input' ? 'inlet' : 'outlet']:
                reservedSocket,
              parentId: id,
            }}
            fallback={fallback}
          />
        )}
      </svg>

      {Object.values(nodes)
        .filter((node) => node.parentId === id)
        .map(({ isHyper, nodeId }) => {
          const schema = schemas.find((schema) => schema.id === nodeId)

          if (!schema) return null

          if (isHyper) {
            return (
              <HyperReactorNodeView
                id={nodeId}
                key={nodeId}
                name="hyper"
                inputParams={['x']}
                outputParams={['y']}
              >
                <ReactorModule reactor={schema} onChange={update} />
              </HyperReactorNodeView>
            )
          }

          return (
            <ReactorNodeView
              id={nodeId}
              key={nodeId}
              name={schema.name}
              {...getReactorSockets(schema.name as ReactorName)}
            >
              <ReactorModule reactor={schema} onChange={update} />
            </ReactorNodeView>
          )
        })}
    </article>
  )
}

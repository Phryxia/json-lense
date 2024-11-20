import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react'
import { ReactorView } from './ReactorView'
import {
  ReactorVisualContextProvider,
  useReactorVisual,
} from './ReactorVisualContext'
import { ReactorEdgeView } from './ReactorEdgeView'
import { getConnectionKey } from './utils'
import { checkOutside } from '@src/logic/shared/outsideClick'

const cx = cnx.bind(styles)

export function ReactorEditor() {
  return (
    <ReactorVisualContextProvider>
      <ReactorEditorContents />
    </ReactorVisualContextProvider>
  )
}

function ReactorEditorContents() {
  const { dimensionPool, connector, mouse } = useReactorVisual()
  const dragTarget = useRef(-1)

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLElement>, id: number) => {
      e.stopPropagation()
      dragTarget.current = id
    },
    [],
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      dragTarget.current = -1

      if (
        connector.waiting &&
        checkOutside(e, (dom) => dom.id.includes('socket'))
      ) {
        connector.cancel()
      }
    },
    [connector.waiting],
  )

  useLayoutEffect(() => {
    addEventListener('mouseup', handleMouseUp)
    return () => removeEventListener('mouseup', handleMouseUp)
  }, [connector.waiting])

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    if (dragTarget.current === -1) return

    const rootBound = e.currentTarget.getBoundingClientRect()

    if (
      rootBound.left >= e.pageX ||
      rootBound.right <= e.pageX ||
      rootBound.top >= e.pageY ||
      rootBound.bottom <= e.pageY
    ) {
      dragTarget.current = -1
      return
    }

    dimensionPool.modify(dragTarget.current, ({ x, y }) => ({
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
      {/* Edges */}
      <svg className={cx('edges')}>
        {connector.connections.map((connection) => (
          <ReactorEdgeView
            connection={connection}
            key={getConnectionKey(connection)}
          />
        ))}
        {connector.waiting && (
          <ReactorEdgeView
            connection={{
              [connector.isSource ? 'source' : 'target']: connector.waiting,
            }}
          />
        )}
      </svg>

      {dimensionPool.elements.map((_, id) => (
        <ReactorView
          id={id}
          key={id}
          name="test"
          handleMouseDown={(e) => handleMouseDown(e, id)}
          inputParams={['a', 'b', 'c']}
          outputParams={['d', 'e']}
        />
      ))}

      <div className={cx('ui')}>
        <button
          onClick={() =>
            dimensionPool.add({
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

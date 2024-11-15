import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { MouseEvent, useCallback, useRef } from 'react'
import { ReactorView } from './ReactorView'
import {
  ReactorVisualContextProvider,
  useReactor,
} from './ReactorVisualContext'

const cx = cnx.bind(styles)

export function ReactorEditor() {
  return (
    <ReactorVisualContextProvider>
      <ReactorEditorContents />
    </ReactorVisualContextProvider>
  )
}

function ReactorEditorContents() {
  const { dimensions, createDimension, updateDimension } = useReactor()
  const dragTarget = useRef(-1)

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLElement>, id: number) => {
      e.stopPropagation()
      dragTarget.current = id
    },
    [],
  )

  const handleMouseUp = useCallback(() => {
    dragTarget.current = -1
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
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

    updateDimension(dragTarget.current, ({ x, y }) => ({
      x: x + e.movementX,
      y: y + e.movementY,
    }))
  }, [])

  return (
    <article className={cx('root')} onMouseMove={handleMouseMove}>
      <button
        onClick={() =>
          createDimension({
            x: Math.random() * 100,
            y: Math.random() * 100,
          })
        }
      >
        ADD
      </button>
      {dimensions.map((_, id) => (
        <ReactorView
          id={id}
          key={id}
          name="test"
          handleMouseDown={(e) => handleMouseDown(e, id)}
          handleMouseUp={handleMouseUp}
        />
      ))}
    </article>
  )
}

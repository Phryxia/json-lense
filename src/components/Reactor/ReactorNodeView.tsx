import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { MouseEvent, useCallback, type PropsWithChildren } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import { ReactorSocket } from './ReactorSocket'
import { getReactorNodeKey } from './utils'

const cx = cnx.bind(styles)

export type ReactorNodeViewProps = PropsWithChildren<{
  id: number
  name: string
  inputParams?: string[]
  outputParams?: string[]
}>

export function ReactorNodeView({
  id,
  name,
  inputParams,
  outputParams,
  children,
}: ReactorNodeViewProps) {
  const { nodeEditor, draggingNodeId } = useReactorVisual()
  const dimension = nodeEditor.nodes[id]

  const handleMouseDown = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    draggingNodeId.current = id
  }, [])

  return (
    <article
      id={getReactorNodeKey(id)}
      className={cx('node')}
      style={{
        left: `${dimension.x}px`,
        top: `${dimension.y}px`,
        width: dimension.w && `${dimension.w}px`,
        height: dimension.h && `${dimension.h}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <header>{name}</header>
      <section className={cx('body')}>
        {inputParams && (
          <div className={cx('sockets', 'left')}>
            {inputParams.map((paramName, socketId) => (
              <ReactorSocket
                id={socketId}
                name={paramName}
                key={paramName}
                ownerReactorId={id}
                color="#844"
                isInput
              />
            ))}
          </div>
        )}
        {children}
        {outputParams && (
          <div className={cx('sockets')}>
            {outputParams.map((paramName, socketId) => (
              <ReactorSocket
                id={socketId}
                name={paramName}
                key={paramName}
                ownerReactorId={id}
                color="#844"
              />
            ))}
          </div>
        )}
      </section>
    </article>
  )
}

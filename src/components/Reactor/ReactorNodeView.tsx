import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { MouseEvent, useCallback, type PropsWithChildren } from 'react'
import { useReactorVisual } from '@src/components/Reactor/visual/ReactorVisualContext'
import { ReactorSocket } from './ReactorSocket'
import { getReactorNodeKey } from './utils'

const cx = cnx.bind(styles)

export type ReactorNodeViewProps = PropsWithChildren<{
  id: string
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
  const { nodes, draggingNodeId, removeNode } = useReactorVisual()
  const dimension = nodes[id]

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
      }}
      onMouseDown={handleMouseDown}
    >
      <header className={cx('header')}>
        <span>{name}</span>
        <button className={cx('close-button')} onClick={() => removeNode(id)}>
          ×
        </button>
      </header>
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

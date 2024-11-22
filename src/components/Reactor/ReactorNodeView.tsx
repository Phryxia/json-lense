import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import type { DOMAttributes, PropsWithChildren } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import { ReactorSocket } from './ReactorSocket'
import { getReactorNodeKey } from './utils'

const cx = cnx.bind(styles)

type Props = {
  id: number
  name: string
  inputParams?: string[]
  outputParams?: string[]
  handleMouseDown: DOMAttributes<HTMLElement>['onMouseDown']
}

export function ReactorNodeView({
  id,
  name,
  inputParams,
  outputParams,
  handleMouseDown,
  children,
}: PropsWithChildren<Props>) {
  const { dimensionPool } = useReactorVisual()
  const dimension = dimensionPool.elements[id]

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

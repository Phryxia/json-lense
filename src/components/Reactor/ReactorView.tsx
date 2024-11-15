import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { DOMAttributes, PropsWithChildren } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import { ReactorSocket } from './ReactorSocket'

const cx = cnx.bind(styles)

type Props = {
  id: number
  name: string
  handleMouseDown: DOMAttributes<HTMLElement>['onMouseDown']
  handleMouseUp: DOMAttributes<HTMLElement>['onMouseUp']
}

export function ReactorView({
  id,
  name,
  handleMouseDown,
  handleMouseUp,
  children,
}: PropsWithChildren<Props>) {
  const { dimensionPool } = useReactorVisual()
  const dimension = dimensionPool.elements[id]

  return (
    <article
      className={cx('node')}
      style={{
        left: `${dimension.x}px`,
        top: `${dimension.y}px`,
        width: dimension.w && `${dimension.w}px`,
        height: dimension.h && `${dimension.h}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <header>{name}</header>
      <section className={cx('body')}>
        <div className={cx('sockets', 'left')}>
          <ReactorSocket name="s0" ownerReactorId={0} color="#844" isInput />
        </div>
        {children}
        <div className={cx('sockets')}>
          <ReactorSocket name="t0" ownerReactorId={0} color="#844" />
          <ReactorSocket name="t0" ownerReactorId={0} color="#844" />
        </div>
      </section>
    </article>
  )
}

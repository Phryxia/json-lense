import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { DOMAttributes, PropsWithChildren } from 'react'
import { useReactorVisual } from './ReactorVisualContext'

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
  const { dimensions } = useReactorVisual()
  const dimension = dimensions[id]

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
      {children}
    </article>
  )
}

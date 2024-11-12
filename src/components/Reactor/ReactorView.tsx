import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { DOMAttributes } from 'react'
import { useReactor } from './ReactorVisualContext'

const cx = cnx.bind(styles)

type Props = {
  id: number
  name: string
  handleMouseDown: DOMAttributes<HTMLElement>['onMouseDown']
  handleMouseUp: DOMAttributes<HTMLElement>['onMouseUp']
}

export function ReactorView({ id, handleMouseDown, handleMouseUp }: Props) {
  const { dimensions } = useReactor()
  const dimension = dimensions[id]

  return (
    <article
      className={cx('node')}
      style={{
        left: `${dimension.x}px`,
        top: `${dimension.y}px`,
        width: `${dimension.w}px`,
        height: `${dimension.h}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* <h1>{name}</h1> */}
    </article>
  )
}

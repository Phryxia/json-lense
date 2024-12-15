import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { useReactorVisual } from './visual/ReactorVisualContext'
import { getReactorSocketKey } from './utils'
import type { ReactorSocket } from './types'

const cx = cnx.bind(styles)

type Props = {
  id: number
  name: string
  ownerReactorId: string
  isInput?: boolean
  color?: string
}

export function ReactorSocket({
  id,
  name,
  ownerReactorId,
  isInput,
  color = '#444',
}: Props) {
  const { tryConnection } = useReactorVisual()

  const socket = {
    nodeId: ownerReactorId,
    socketId: id,
    socketType: isInput ? 'input' : 'output',
  } satisfies ReactorSocket

  return (
    <button
      id={getReactorSocketKey(socket)}
      className={cx('socket', { reverse: isInput })}
      onClick={() => tryConnection(socket)}
    >
      <span className={cx('name')}>{name}</span>
      <div className={cx('circle')} style={{ backgroundColor: color }} />
    </button>
  )
}

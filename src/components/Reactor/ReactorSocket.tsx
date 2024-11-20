import cnx from 'classnames/bind'
import styles from './Reactor.module.css'
import { useReactorVisual } from './ReactorVisualContext'
import { getReactorSocketKey } from './utils'
import type { ConnectionRequest } from './types'

const cx = cnx.bind(styles)

type Props = {
  id: number
  name: string
  ownerReactorId: number
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
  const { connector } = useReactorVisual()

  const connectionRequest = {
    nodeId: ownerReactorId,
    socketId: id,
    socketType: isInput ? 'input' : 'output',
  } satisfies ConnectionRequest

  return (
    <button
      id={getReactorSocketKey(connectionRequest)}
      className={cx('socket', { reverse: isInput })}
      onClick={() => {
        connector.tryConnection(connectionRequest)
      }}
    >
      <span className={cx('name')}>{name}</span>
      <div className={cx('circle')} style={{ backgroundColor: color }} />
    </button>
  )
}

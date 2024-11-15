import cnx from 'classnames/bind'
import styles from './Reactor.module.css'

const cx = cnx.bind(styles)

type Props = {
  name: string
  ownerReactorId: number
  isInput?: boolean
  color?: string
}

export function ReactorSocket({
  name,
  ownerReactorId,
  isInput,
  color = '#444',
}: Props) {
  return (
    <button className={cx('socket', { reverse: isInput })}>
      <span className={cx('name')}>{name}</span>
      <div className={cx('circle')} style={{ backgroundColor: color }} />
    </button>
  )
}

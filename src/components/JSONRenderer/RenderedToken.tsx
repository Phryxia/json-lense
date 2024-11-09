import cnx from 'classnames/bind'
import styles from './JSONRenderer.module.css'
import type { JSONToken } from './types'

const cx = cnx.bind(styles)

type Props = {
  token: JSONToken
}

export function RenderedToken({ token: { type, content } }: Props) {
  return <span className={cx(type.toLowerCase())}>{content}</span>
}

import cnx from 'classnames/bind'
import styles from './JSONInspector.module.css'
import { JSONRenderer } from './JSONRenderer'
import { JSONSearch } from './JSONSearch'
import { JSONInspectorProvider } from './JSONInspectorContext'

const cx = cnx.bind(styles)

type Props = {
  json: any
  height: number
}

export function JSONInspector({ json, height }: Props) {
  return (
    <JSONInspectorProvider json={json}>
      <section className={cx('root')}>
        <JSONSearch />
        <JSONRenderer height={height} />
      </section>
    </JSONInspectorProvider>
  )
}

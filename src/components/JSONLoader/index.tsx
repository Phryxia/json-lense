import cns from 'classnames/bind'
import styles from './JSONLoader.module.css'
import { createElement, ReactElement, useState } from 'react'
import type { LoaderProps } from './types'
import { LoaderType } from './consts'
import { LoaderNav } from './JSONLoaderNav'
import { JSONTextLoader } from './JSONTextLoader'
import { JSONClipboardLoader } from './JSONClipboardLoader'
import { JSONFileLoader } from './JSONFileLoader'
import { JSONUrlLoadedIndicator } from './JSONUrlLoadedIndicator'

const cx = cns.bind(styles)

const Loaders: Record<LoaderType, (props: LoaderProps) => ReactElement> = {
  [LoaderType.FromText]: JSONTextLoader,
  [LoaderType.FromClipboard]: JSONClipboardLoader,
  [LoaderType.FromFile]: JSONFileLoader,
  [LoaderType.FromURL]: JSONUrlLoadedIndicator,
}

type Props = {
  onLoad(json: any): void
}

export function JSONLoader({ onLoad }: Props) {
  const [loaderType, setLoaderType] = useState(
    window.location.search.includes('data=')
      ? LoaderType.FromURL
      : LoaderType.FromText,
  )

  return (
    <section className={cx('json-loader')}>
      <article>
        <LoaderNav loaderType={loaderType} onChange={setLoaderType} />
        {createElement(Loaders[loaderType], { onLoad })}
      </article>
    </section>
  )
}

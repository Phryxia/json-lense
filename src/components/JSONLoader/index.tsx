import { createElement, ReactElement, useState } from 'react'
import type { LoaderProps } from './types'
import { LoaderType } from './consts'
import { LoaderNav } from './JSONLoaderNav'
import { JSONTextLoader } from './JSONTextLoader'
import { JSONClipboardLoader } from './JSONClipboardLoader'
import { JSONFileLoader } from './JSONFileLoader'

const Loaders: Record<LoaderType, (props: LoaderProps) => ReactElement> = {
  [LoaderType.FromText]: JSONTextLoader,
  [LoaderType.FromClipboard]: JSONClipboardLoader,
  [LoaderType.FromFile]: JSONFileLoader,
}

type Props = {
  onLoad(json: any): void
}

export function JSONLoader({ onLoad }: Props) {
  const [loaderType, setLoaderType] = useState(LoaderType.FromText)

  return (
    <section>
      <LoaderNav loaderType={loaderType} onChange={setLoaderType} />
      {createElement(Loaders[loaderType], { onLoad })}
    </section>
  )
}

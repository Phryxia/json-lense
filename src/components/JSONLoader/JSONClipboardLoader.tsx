import { useState } from 'react'
import { JSONInspector } from '../JSONInspector'
import { JSONSyntaxError } from './JSONSyntaxError'
import { LoaderProps } from './types'

export function JSONClipboardLoader({ onLoad }: LoaderProps) {
  const [json, setJson] = useState<any>()
  const [source, setSource] = useState('')
  const [error, setError] = useState<Error>()

  async function handleClick() {
    const text = await navigator.clipboard.readText()

    setSource(text)

    try {
      const json = JSON.parse(text)
      onLoad(json)
      setJson(json)
      setError(undefined)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
        setJson(undefined)
      }
    }
  }

  return (
    <article>
      <section>
        <button onClick={handleClick}>Click to paste!</button>
      </section>

      {error && (
        <section>
          <hr />
          <JSONSyntaxError error={error} source={source} />
        </section>
      )}
      {json !== undefined && (
        <section>
          <JSONInspector json={json} height={200} />
        </section>
      )}
    </article>
  )
}

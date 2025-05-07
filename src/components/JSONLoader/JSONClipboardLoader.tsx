import { useState } from 'react'
import { JSONSyntaxError } from './JSONSyntaxError'
import { LoaderProps } from './types'

export function JSONClipboardLoader({ onLoad }: LoaderProps) {
  const [source, setSource] = useState('')
  const [error, setError] = useState<Error>()

  async function handleClick() {
    const text = await navigator.clipboard.readText()

    setSource(text)

    try {
      const json = JSON.parse(text)
      onLoad(json)
      setError(undefined)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }

  return (
    <>
      <section>
        <button onClick={handleClick}>Click to paste!</button>
      </section>

      {error && (
        <section>
          <hr />
          <JSONSyntaxError error={error} source={source} />
        </section>
      )}
    </>
  )
}

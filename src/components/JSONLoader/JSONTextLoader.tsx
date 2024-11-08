import { useState } from 'react'
import type { LoaderProps } from './types'
import { JSONSyntaxError } from './JSONSyntaxError'

export function JSONTextLoader({ onLoad }: LoaderProps) {
  const [source, setSource] = useState('')
  const [error, setError] = useState<Error>()

  return (
    <article>
      <textarea
        value={source}
        onChange={(e) => {
          const text = e.target.value
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
        }}
        placeholder="Type JSON data here"
      />
      {error && <JSONSyntaxError error={error} source={source} />}
    </article>
  )
}

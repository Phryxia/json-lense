import { useMemo } from 'react'
import { JSONInspector } from '../JSONInspector'

interface Props {
  json: any
}

export function JSONExplorer({ json }: Props) {
  const output = useMemo(() => {
    if (!json) return undefined

    return json
  }, [json])

  return (
    <article>{output && <JSONInspector height={300} json={output} />}</article>
  )
}

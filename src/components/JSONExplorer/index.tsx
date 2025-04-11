import { useMemo } from 'react'
import { createMolecule, serializeMolecule } from '@src/logic/molecule'
import { JSONInspector } from '../JSONInspector'

interface Props {
  json: any
}

export function JSONExplorer({ json }: Props) {
  const output = useMemo(() => {
    if (!json) return undefined

    const output = createMolecule(json)
    return JSON.parse(serializeMolecule(output)).root
  }, [json])

  return (
    <article>{output && <JSONInspector height={300} json={output} />}</article>
  )
}

import { useMemo } from 'react'
import { createMolecule, serializeMolecule } from '@src/logic/molecule'
import { useReactor } from '@src/components/Reactor/model/ReactorModelContext'
import { JSONInspector } from '../JSONInspector'

interface Props {
  json: any
}

export function JSONExplorer({ json }: Props) {
  const { finalLense } = useReactor()

  const output = useMemo(() => {
    if (!json || !finalLense) return undefined

    const output = finalLense.run(createMolecule(json))[0]
    return JSON.parse(serializeMolecule(output)).root
  }, [json, finalLense])

  return (
    <article>{output && <JSONInspector height={300} json={output} />}</article>
  )
}

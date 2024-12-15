import { ReactorNodeView } from './ReactorNodeView'
import { getHyperReactorInnerSocketKey } from './utils'

interface Props {
  nodeId: string
  isOutput?: boolean
}

export function HyperReactorInnerSocket({ nodeId, isOutput }: Props) {
  return (
    <ReactorNodeView
      id={getHyperReactorInnerSocketKey({
        nodeId,
        socketType: isOutput ? 'output' : 'input',
      })}
      inputParams={isOutput ? ['output'] : undefined}
      outputParams={isOutput ? undefined : ['input']}
      isFixed
    />
  )
}

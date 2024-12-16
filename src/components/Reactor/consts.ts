import { getHyperReactorInnerSocketKey } from './utils'

export const ROOT_INPUT_INNER_SOCKET_ID = getHyperReactorInnerSocketKey({
  nodeId: 'root',
  socketType: 'output',
})

export const ROOT_OUTPUT_INNER_SOCKET_ID = getHyperReactorInnerSocketKey({
  nodeId: 'root',
  socketType: 'input',
})

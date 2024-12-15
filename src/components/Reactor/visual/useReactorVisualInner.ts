import { DirectedGraph } from '@src/logic/shared/graph'
import { useSafeReducer } from '@src/logic/shared/useSafeReducer'
import type { ReactorEdge, ReactorNode } from '../types'

interface ReactorVisualState {
  nodes: Record<string, ReactorNode>
  graph: DirectedGraph<string, ReactorEdge>
}

type ReactorVisualAction =
  | {
      method: 'createNode'
      node: ReactorNode
    }
  | { method: 'removeNode'; nodeId: string }
  | { method: 'modifyNode'; nodeId: string; x: number; y: number }
  | { method: 'connect'; edge: ReactorEdge }
  | { method: 'disconnect'; edge: ReactorEdge }

export function useReactorVisualInner() {
  return useSafeReducer(
    ({ nodes, graph }: ReactorVisualState, action: ReactorVisualAction) => {
      const nextNodes = { ...nodes }

      switch (action.method) {
        case 'createNode':
          nextNodes[action.node.nodeId] = action.node
          graph.addNode(action.node.nodeId)
          break

        case 'removeNode':
          delete nextNodes[action.nodeId]
          graph.removeNode(action.nodeId)
          break

        case 'modifyNode':
          nextNodes[action.nodeId].x = action.x
          nextNodes[action.nodeId].y = action.y
          break

        case 'connect':
          graph.connect(
            action.edge.outlet.nodeId,
            action.edge.inlet.nodeId,
            action.edge,
          )
          break

        case 'disconnect':
          graph.disconnect(
            action.edge.outlet.nodeId,
            action.edge.inlet.nodeId,
            action.edge,
          )
          break
      }

      return {
        nodes: nextNodes,
        edges: graph.edges(),
        graph,
      }
    },
    {
      nodes: {} as Record<string, ReactorNode>,
      edges: [],
      graph: new DirectedGraph<string, ReactorEdge>(),
    },
  )
}

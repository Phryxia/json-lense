import { useCallback, useState } from 'react'
import { fx } from '@fxts/core'
import type { DirectedGraph } from '@src/logic/shared/graph'
import { useReactor } from '../model/ReactorModelContext'
import type { ReactorEdge, ReactorNode, ReactorSocket } from '../types'
import type { ReactorVisualAction } from './useReactorVisualInner'

interface Params {
  nodes: Record<string, ReactorNode>
  graph: DirectedGraph<string, ReactorEdge>
  dispatch: (action: ReactorVisualAction) => void
}

export function useTryConnection({ nodes, graph, dispatch }: Params) {
  const { connect } = useReactor()
  const [reservedSocket, setReservedSocket] = useState<ReactorSocket>()

  /** @inner */
  function handleConnect(edge: ReactorEdge) {
    connect({
      sourceId: edge.outlet.nodeId,
      sourceSocketId: edge.outlet.socketId,
      targetId: edge.inlet.nodeId,
    })
    dispatch({
      method: 'connect',
      edge,
    })
  }

  const cancelConnection = useCallback(() => {
    setReservedSocket(undefined)
  }, [])

  const tryConnection = useCallback(
    (newSocket: ReactorSocket) => {
      if (reservedSocket) {
        const orderedSockets = sortHeterogeneousSocket(
          reservedSocket,
          newSocket,
        )

        // should not same type
        if (!orderedSockets) {
          cancelConnection()
          return
        }

        const [fromSocket, toSocket] = orderedSockets
        const from = nodes[fromSocket.nodeId]
        const to = nodes[toSocket.nodeId]

        if (
          // should not connect same node
          from.nodeId !== to.nodeId &&
          // sholud be same parent
          from.parentId === to.parentId &&
          // no input duplicated are allowed
          !findEdgeBySocket(graph, toSocket) &&
          // no cycle are allowed
          !graph.checkCycle(from.nodeId, to.nodeId)
        ) {
          handleConnect({
            outlet: fromSocket,
            inlet: toSocket,
            parentId: from.parentId,
          })
        }

        // clean up
        cancelConnection()
      } else {
        const alreadyConnectedEdge = findEdgeBySocket(graph, newSocket)

        if (alreadyConnectedEdge && newSocket.socketType === 'input') {
          // reserve old socket and disconnect
          setReservedSocket(alreadyConnectedEdge.outlet)
          dispatch({ method: 'disconnect', edge: alreadyConnectedEdge })
        } else {
          // reserve new socket
          // note that outlet may have multiple edges
          setReservedSocket(newSocket)
        }
      }
    },
    [reservedSocket, nodes, graph, dispatch],
  )

  return {
    reservedSocket,
    cancelConnection,
    tryConnection,
  }
}

function findEdgeBySocket(
  graph: DirectedGraph<string, ReactorEdge>,
  { nodeId, socketType }: ReactorSocket,
) {
  if (socketType === 'output') {
    return fx(graph.getForwardNeighbors(nodeId).values())
      .flat()
      .find((edge) => edge.outlet.nodeId === nodeId)
  }
  return fx(graph.getBackwardNeighbors(nodeId).values())
    .flat()
    .find((edge) => edge.inlet.nodeId === nodeId)
}

function sortHeterogeneousSocket(
  a: ReactorSocket,
  b: ReactorSocket,
):
  | [
      ReactorSocket & { socketType: 'output' },
      ReactorSocket & { socketType: 'input' },
    ]
  | null {
  if (a.socketType === b.socketType) {
    return null
  }

  if (a.socketType === 'input') {
    // @ts-ignore
    return [b, a]
  }
  // @ts-ignore
  return [a, b]
}

import { MutableRefObject, useCallback, useState } from 'react'
import { produce } from 'immer'
import type { ReactorEdge, ReactorGraph, ReactorSocket } from './types'
import { compareSocket } from './utils'

export function useEdgeEditor(graph: MutableRefObject<ReactorGraph>) {
  const [reservedSocket, setReservedSocket] = useState<ReactorSocket>()
  const [edges, setEdges] = useState<ReactorEdge[]>([])

  // private
  const add = useCallback((edge: ReactorEdge) => {
    graph.current.connect(edge.outlet.nodeId, edge.inlet.nodeId, edge)
    setEdges((edges) => [...edges, edge])
  }, [])

  // private
  const remove = useCallback(
    (req: ReactorSocket) => {
      edges.forEach((edge) => {
        if (compareSocket(edge.inlet, req) || compareSocket(edge.outlet, req)) {
          graph.current.disconnect(edge.outlet.nodeId, edge.inlet.nodeId, edge)
        }
      })

      setEdges(
        produce((edges) =>
          edges.filter(({ inlet, outlet }) =>
            req.socketType === 'input'
              ? !compareSocket(inlet, req)
              : !compareSocket(outlet, req),
          ),
        ),
      )
    },
    [edges],
  )

  const cancelConnection = useCallback(() => {
    setReservedSocket(undefined)
  }, [])

  const findEdge = useCallback(
    (req: ReactorSocket) =>
      edges.find(({ inlet, outlet }) =>
        req.socketType === 'input'
          ? compareSocket(inlet, req)
          : compareSocket(outlet, req),
      ),
    [edges],
  )

  const tryConnection = useCallback(
    (newSocket: ReactorSocket) => {
      if (reservedSocket) {
        if (
          // should not connect same node
          reservedSocket.nodeId !== newSocket.nodeId &&
          // should not connect same input / output
          reservedSocket.socketType !== newSocket.socketType &&
          // no duplicated are allowed
          !findEdge(newSocket) &&
          !checkCycle(graph.current, newSocket, reservedSocket)
        ) {
          add(
            reservedSocket.socketType === 'input'
              ? {
                  inlet: reservedSocket as ReactorSocket & {
                    socketType: 'input'
                  },
                  outlet: newSocket as ReactorSocket & { socketType: 'output' },
                }
              : {
                  inlet: newSocket as ReactorSocket & { socketType: 'input' },
                  outlet: reservedSocket as ReactorSocket & {
                    socketType: 'output'
                  },
                },
          )
        }

        // clean up
        cancelConnection()
      } else {
        const alreadyConnectedEdge = findEdge(newSocket)

        if (alreadyConnectedEdge) {
          // reserve old socket and disconnect it
          if (newSocket.socketType === 'input') {
            setReservedSocket(alreadyConnectedEdge.outlet)
          } else {
            setReservedSocket(alreadyConnectedEdge.inlet)
          }
          remove(newSocket)
        } else {
          // reserve new socket
          setReservedSocket(newSocket)
        }
      }
    },
    [reservedSocket, edges],
  )

  return {
    edges,
    cancelConnection,
    tryConnection,
    reservedSocket,
  }
}

function checkCycle(
  graph: ReactorGraph,
  socket0: ReactorSocket,
  socket1: ReactorSocket,
) {
  if (socket0.socketType === 'input') {
    const temp = socket0
    socket0 = socket1
    socket1 = temp
  }

  return graph.checkCycle(socket0.nodeId, socket1.nodeId)
}

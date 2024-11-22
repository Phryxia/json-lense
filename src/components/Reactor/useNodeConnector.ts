import { useCallback, useState } from 'react'
import { produce } from 'immer'
import type { ReactorEdge, ReactorSocket } from './types'
import { compareSocket } from './utils'

export function useEdgeEditor() {
  const [reservedSocket, setReservedSocket] = useState<ReactorSocket>()
  const [edges, setEdges] = useState<ReactorEdge[]>([])

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

  const remove = useCallback(
    (req: ReactorSocket) => {
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

  const tryConnection = useCallback(
    (newSocket: ReactorSocket) => {
      if (reservedSocket) {
        if (
          // should not connect same node
          reservedSocket.nodeId !== newSocket.nodeId &&
          // should not connect same input / output
          reservedSocket.socketType !== newSocket.socketType &&
          !findEdge(newSocket)
        ) {
          const newConnection =
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
                }
          setEdges([...edges, newConnection])
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

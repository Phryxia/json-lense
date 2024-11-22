import { useCallback, useState } from 'react'
import { filter } from '@fxts/core'
import { produce } from 'immer'
import type { ReactorEdge, ReactorSocket } from './types'
import { compareSocket } from './utils'

export function useEdgeEditor() {
  const [reservedSocket, setReservedSocket] = useState<ReactorSocket>()
  const [isSource, setIsSource] = useState(true)
  const [edges, setEdges] = useState<ReactorEdge[]>([])

  const cancelConnection = useCallback(() => {
    setReservedSocket(undefined)
    setIsSource(true)
  }, [])

  const findEdge = useCallback(
    (req: ReactorSocket) =>
      edges.find(
        ({ source, target }) =>
          compareSocket(source, req) || compareSocket(target, req),
      ),
    [edges],
  )

  const remove = useCallback(
    (req: ReactorSocket) => {
      setEdges(
        produce(
          filter(
            ({ source, target }) =>
              !compareSocket(source, req) && !compareSocket(target, req),
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
          reservedSocket.nodeId !== newSocket.nodeId &&
          reservedSocket.socketType !== newSocket.socketType &&
          !findEdge(newSocket)
        ) {
          const newConnection = isSource
            ? {
                source: reservedSocket,
                target: newSocket,
              }
            : {
                source: newSocket,
                target: reservedSocket,
              }
          setEdges([...edges, newConnection])
        }
        cancelConnection()
      } else {
        const alreadyConnectedEdge = findEdge(newSocket)

        if (alreadyConnectedEdge) {
          if (compareSocket(alreadyConnectedEdge.source, newSocket)) {
            setReservedSocket(alreadyConnectedEdge.target)
            setIsSource(false)
          } else {
            setReservedSocket(alreadyConnectedEdge.source)
            setIsSource(true)
          }
          remove(newSocket)
        } else {
          setReservedSocket(newSocket)
          setIsSource(true)
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
    isSource,
  }
}

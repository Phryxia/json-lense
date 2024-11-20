import { useCallback, useState } from 'react'
import { produce } from 'immer'
import type { Connection, ConnectionRequest } from './types'

export function useNodeConnector() {
  const [waiting, setWaiting] = useState<ConnectionRequest>()
  const [isSource, setIsSource] = useState(true)
  const [connections, setConnections] = useState<Connection[]>([])

  const cancel = useCallback(() => {
    setWaiting(undefined)
    setIsSource(true)
  }, [])

  const findConnection = useCallback(
    (req: ConnectionRequest) =>
      connections.find(
        (conn) =>
          compareConnectionRequest(conn.source, req) ||
          compareConnectionRequest(conn.target, req),
      ),
    [connections],
  )

  const remove = useCallback(
    (req: ConnectionRequest) => {
      setConnections(
        produce((conns) =>
          conns.filter(
            (conn) =>
              !compareConnectionRequest(conn.source, req) &&
              !compareConnectionRequest(conn.target, req),
          ),
        ),
      )
    },
    [connections],
  )

  const tryConnection = useCallback(
    (req: ConnectionRequest) => {
      if (waiting) {
        if (
          waiting.nodeId !== req.nodeId &&
          waiting.socketType !== req.socketType &&
          !findConnection(req)
        ) {
          const newConnection = isSource
            ? {
                source: waiting,
                target: req,
              }
            : {
                source: req,
                target: waiting,
              }
          setConnections([...connections, newConnection])
        }
        cancel()
      } else {
        const conn = findConnection(req)

        if (conn) {
          if (compareConnectionRequest(conn.source, req)) {
            setWaiting(conn.target)
            setIsSource(false)
          } else {
            setWaiting(conn.source)
            setIsSource(true)
          }
          remove(req)
        } else {
          setWaiting(req)
          setIsSource(true)
        }
      }
    },
    [waiting, connections],
  )

  return {
    connections,
    cancel,
    tryConnection,
    waiting,
    isSource,
  }
}

function compareConnectionRequest(a: ConnectionRequest, b: ConnectionRequest) {
  return (
    a.nodeId === b.nodeId &&
    a.socketId === b.socketId &&
    a.socketType === b.socketType
  )
}

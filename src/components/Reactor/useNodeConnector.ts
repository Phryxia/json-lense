import { useCallback, useState } from 'react'
import type { Connection, ConnectionPerNode, ConnectionRequest } from './types'

export function useNodeConnector() {
  const [source, setSource] = useState<ConnectionRequest>()

  const [connectionMap, setConnectionMap] = useState<ConnectionPerNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])

  const cancel = useCallback(() => {
    setSource(undefined)
  }, [])

  const tryConnection = useCallback(
    (req: ConnectionRequest) => {
      if (source) {
        if (
          source.nodeId !== req.nodeId &&
          source.socketType !== req.socketType &&
          !connections.some((connection) =>
            compareConnectionRequest(connection.source, req),
          )
        ) {
          // list type
          const newConnection = {
            source: source,
            target: req,
          }
          setConnections([...connections, newConnection])

          // array type
          const newConnectionMap = connectionMap.slice()
          newConnectionMap[source.nodeId] ??= {
            input: [],
            output: [],
          }
          newConnectionMap[source.nodeId][source.socketType].push(newConnection)
          newConnectionMap[req.nodeId] ??= { input: [], output: [] }
          newConnectionMap[req.nodeId][req.socketType].push(newConnection)
          setConnectionMap(newConnectionMap)

          setSource(undefined)
        }
        cancel()
      } else {
        setSource(req)
      }
    },
    [source, connectionMap, connections],
  )

  return {
    connections,
    cancel,
    tryConnection,
  }
}

function compareConnectionRequest(a: ConnectionRequest, b: ConnectionRequest) {
  return (
    a.nodeId === b.nodeId &&
    a.socketId === b.socketId &&
    a.socketType === b.socketType
  )
}

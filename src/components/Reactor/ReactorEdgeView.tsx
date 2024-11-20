import { useLayoutEffect, useState } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import type { Connection, ConnectionRequest } from './types'
import { getReactorKey, getReactorSocketKey } from './utils'

type Props = {
  connection: Connection
}

export function ReactorEdgeView({ connection }: Props) {
  const { dimensionPool } = useReactorVisual()
  const sourceDimension = dimensionPool.get(connection.source.nodeId)
  const targetDimension = dimensionPool.get(connection.target.nodeId)

  const [biasX1, biasY1] = useSocketBias(connection.source)
  const [biasX2, biasY2] = useSocketBias(connection.target)

  return (
    <line
      x1={sourceDimension.x + biasX1}
      y1={sourceDimension.y + biasY1}
      x2={targetDimension.x + biasX2}
      y2={targetDimension.y + biasY2}
      stroke="black"
    />
  )
}

function useSocketBias(socket: ConnectionRequest) {
  const [biasX, setBiasX] = useState(0)
  const [biasY, setBiasY] = useState(0)

  useLayoutEffect(() => {
    const nodeId = getReactorKey(socket.nodeId)
    const nodeDom = document.getElementById(nodeId)

    if (!nodeDom) {
      console.warn(`Cannot find node dom "${nodeId}"`)
      return
    }

    const socketId = getReactorSocketKey(socket)
    const socketDom = document.getElementById(socketId)

    if (!socketDom) {
      console.warn(`Cannot find socket dom "${socketId}"`)
      return
    }

    const { x: px, y: py } = nodeDom.getBoundingClientRect()
    const { x: sx, y: sy, width, height } = socketDom.getBoundingClientRect()

    setBiasX(sx - px + 0.5 * width)
    setBiasY(sy - py + 0.5 * height)
  }, [socket.nodeId, socket.socketId, socket.socketType])

  return [biasX, biasY]
}

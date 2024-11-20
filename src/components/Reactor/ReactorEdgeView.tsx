import { useLayoutEffect, useState } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import type { Connection, ConnectionRequest } from './types'
import { getReactorKey, getReactorSocketKey } from './utils'

type Props = {
  connection: Partial<Connection>
}

export function ReactorEdgeView({ connection }: Props) {
  const { dimensionPool, mouse } = useReactorVisual()
  const mouseFallback = { x: mouse.mouseX, y: mouse.mouseY }
  const sourceDimension = connection.source
    ? dimensionPool.get(connection.source.nodeId)
    : mouseFallback
  const targetDimension = connection.target
    ? dimensionPool.get(connection.target.nodeId)
    : mouseFallback

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

function useSocketBias(socket: ConnectionRequest | undefined) {
  const [biasX, setBiasX] = useState(0)
  const [biasY, setBiasY] = useState(0)

  useLayoutEffect(() => {
    if (!socket) return

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
  }, [socket?.nodeId, socket?.socketId, socket?.socketType])

  return [biasX, biasY]
}

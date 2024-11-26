import { useLayoutEffect, useState } from 'react'
import { useReactorVisual } from './ReactorVisualContext'
import type { ReactorEdge, ReactorSocket } from './types'
import { getReactorNodeKey, getReactorSocketKey } from './utils'

type Props = {
  edge: Partial<ReactorEdge>
  fallback?: { x: number; y: number }
}

export function ReactorEdgeView({ edge, fallback }: Props) {
  const { nodeEditor } = useReactorVisual()
  const inletPosition = edge.inlet
    ? nodeEditor.nodes[edge.inlet.nodeId]
    : fallback
  const outletPosition = edge.outlet
    ? nodeEditor.nodes[edge.outlet.nodeId]
    : fallback

  const [biasX1, biasY1] = useSocketBias(edge.inlet)
  const [biasX2, biasY2] = useSocketBias(edge.outlet)

  return (
    <line
      x1={(inletPosition?.x ?? 0) + biasX1}
      y1={(inletPosition?.y ?? 0) + biasY1}
      x2={(outletPosition?.x ?? 0) + biasX2}
      y2={(outletPosition?.y ?? 0) + biasY2}
      stroke="black"
    />
  )
}

function useSocketBias(socket: ReactorSocket | undefined) {
  const [biasX, setBiasX] = useState(0)
  const [biasY, setBiasY] = useState(0)

  useLayoutEffect(() => {
    if (!socket) return

    const nodeId = getReactorNodeKey(socket.nodeId)
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

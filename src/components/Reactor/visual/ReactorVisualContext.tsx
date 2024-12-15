import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { DirectedGraph } from '@src/logic/shared/graph'
import type { ReactorEdge, ReactorNode, ReactorSocket } from '../types'
import { checkOutsideMouseEvent } from '@src/logic/shared/checkOutsideMouseEvent'
import { useReactorVisualInner } from './useReactorVisualInner'
import { fx } from '@fxts/core'

type IReactorVisualContext = {
  nodes: Record<string, ReactorNode>
  edges: ReactorEdge[]
  createNode(isHyper?: boolean, parentId?: string): ReactorNode
  removeNode(nodeId: string): void
  updateNode(
    nodeId: string,
    updater: (payload: ReactorNode) => Partial<ReactorNode>,
  ): void
  tryConnection(newSocket: ReactorSocket): void
  reservedSocket: ReactorSocket | undefined
  draggingNodeId: MutableRefObject<string>
  update(nodeId: string): void
  addUpdateListener(nodeId: string, cb: () => void): void
  removeUpdateListener(nodeId: string, cb: () => void): void
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

type Props = PropsWithChildren<{
  onCreation(): string // return id
}>

export function ReactorVisualProvider({ children, onCreation }: Props) {
  const [{ nodes, edges, graph }, dispatch] = useReactorVisualInner()

  const [reservedSocket, setReservedSocket] = useState<ReactorSocket>()
  const draggingNodeId = useRef('')
  const rerenderListeners = useRef<Record<string, (() => void)[]>>({})

  const createNode = useCallback(
    (isHyper?: boolean, parentId?: string) => {
      const nodeId = onCreation()
      const newNode = {
        nodeId,
        isHyper,
        parentId,
        x: 0,
        y: 0,
      }
      dispatch({ method: 'createNode', node: newNode })
      return newNode
    },
    [dispatch, onCreation],
  )

  const removeNode = useCallback(
    (nodeId: string) => {
      dispatch({ method: 'removeNode', nodeId })
    },
    [dispatch],
  )

  const updateNode = useCallback(
    (
      nodeId: string,
      updater: (payload: ReactorNode) => Partial<ReactorNode>,
    ) => {
      const target = nodes[nodeId]

      if (!target) return

      const diff = updater(target)
      dispatch({
        method: 'modifyNode',
        nodeId,
        x: diff.x ?? target.x,
        y: diff.y ?? target.y,
      })
    },
    [nodes, dispatch],
  )

  const cancelConnection = useCallback(() => {
    setReservedSocket(undefined)
  }, [])

  const tryConnection = useCallback(
    (newSocket: ReactorSocket) => {
      if (reservedSocket) {
        const [fromSocket, toSocket] = sortHeterogeneousSocket(
          reservedSocket,
          newSocket,
        )
        const from = nodes[fromSocket.nodeId]
        const to = nodes[toSocket.nodeId]

        if (
          // should not connect same node
          from.nodeId !== to.nodeId &&
          // should not connect same input / output
          reservedSocket.socketType !== newSocket.socketType &&
          // sholud be same parent
          from.parentId === to.parentId &&
          // no duplicated are allowed
          !graph.findEdge(
            from.nodeId,
            to.nodeId,
            (edge) =>
              edge.outlet.nodeId === from.nodeId ||
              edge.inlet.nodeId === to.nodeId,
          ) &&
          !graph.checkCycle(from.nodeId, to.nodeId)
        ) {
          dispatch({
            method: 'connect',
            edge: {
              outlet: fromSocket,
              inlet: toSocket,
              parentId: from.parentId,
            },
          })
        }

        // clean up
        cancelConnection()
      } else {
        const alreadyConnectedEdge = findEdgeBySocket(graph, newSocket)

        if (alreadyConnectedEdge) {
          // reserve old socket and disconnect it
          if (newSocket.socketType === 'input') {
            setReservedSocket(alreadyConnectedEdge.outlet)
          } else {
            setReservedSocket(alreadyConnectedEdge.inlet)
          }
          dispatch({ method: 'disconnect', edge: alreadyConnectedEdge })
        } else {
          // reserve new socket
          setReservedSocket(newSocket)
        }
      }
    },
    [reservedSocket, nodes, graph, dispatch],
  )

  const update = useCallback((nodeId: string) => {
    rerenderListeners.current[nodeId]?.forEach((cb) => cb())
  }, [])

  const addUpdateListener = useCallback((nodeId: string, cb: () => void) => {
    rerenderListeners.current[nodeId] ??= []
    rerenderListeners.current[nodeId].push(cb)
  }, [])

  const removeUpdateListener = useCallback((nodeId: string, cb: () => void) => {
    rerenderListeners.current[nodeId] = rerenderListeners.current[
      nodeId
    ]?.filter((oldCb) => oldCb !== cb)
  }, [])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      draggingNodeId.current = ''

      if (
        reservedSocket &&
        checkOutsideMouseEvent(e, (dom) => dom.id.includes('socket'))
      ) {
        cancelConnection()
      }
    },
    [reservedSocket, cancelConnection],
  )

  useLayoutEffect(() => {
    addEventListener('mouseup', handleMouseUp)
    return () => removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  return (
    <ReactorVisualContext.Provider
      value={{
        nodes,
        edges,
        createNode,
        removeNode,
        updateNode,
        tryConnection,
        reservedSocket,
        draggingNodeId,
        update,
        addUpdateListener,
        removeUpdateListener,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
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
): [
  ReactorSocket & { socketType: 'output' },
  ReactorSocket & { socketType: 'input' },
] {
  if (a.socketType === b.socketType)
    throw new Error(
      `parameters should be different type of sockets, but given ${a.socketType}`,
    )

  if (a.socketType === 'input') {
    // @ts-ignore
    return [b, a]
  }
  // @ts-ignore
  return [a, b]
}

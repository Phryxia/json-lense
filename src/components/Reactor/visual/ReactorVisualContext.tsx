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
import { fx } from '@fxts/core'
import { DirectedGraph } from '@src/logic/shared/graph'
import { checkOutsideMouseEvent } from '@src/logic/shared/checkOutsideMouseEvent'
import type { ReactorEdge, ReactorNode, ReactorSocket } from '../types'
import { useReactorVisualInner } from './useReactorVisualInner'
import { useReactor } from '../model/ReactorModelContext'
import { ReactorName } from '@src/logic/reactor/consts'

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

type Props = PropsWithChildren<{}>

export function ReactorVisualProvider({ children }: Props) {
  const { add: addNodeModel, remove: removeNodeModel } = useReactor()
  const [{ nodes, edges, graph }, dispatch] = useReactorVisualInner()

  const [reservedSocket, setReservedSocket] = useState<ReactorSocket>()
  const draggingNodeId = useRef('')
  const rerenderListeners = useRef<Record<string, (() => void)[]>>({})

  const createNode = useCallback(
    (isHyper?: boolean, parentId?: string) => {
      const nodeId = addNodeModel({
        name: ReactorName.Pick,
        data: [],
      })
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
    [dispatch, addNodeModel],
  )

  const removeNode = useCallback(
    (nodeId: string) => {
      removeNodeModel(nodeId)
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

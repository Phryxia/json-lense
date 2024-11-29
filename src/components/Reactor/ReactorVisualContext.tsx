import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react'
import { DirectedGraph } from '@src/logic/shared/graph'
import type { ReactorEdge } from './types'
import { useEdgeEditor } from './useEdgeEditor'
import { useNodeEditor } from './useNodeEditor'
import { checkOutsideMouseEvent } from '@src/logic/shared/checkOutsideMouseEvent'

type IReactorVisualContext = {
  nodeEditor: ReturnType<typeof useNodeEditor>
  edgeEditor: ReturnType<typeof useEdgeEditor>
  draggingNodeId: MutableRefObject<number>
  update(nodeId: number): void
  addUpdateListener(nodeId: number, cb: () => void): void
  removeUpdateListener(nodeId: number, cb: () => void): void
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

export function ReactorVisualProvider({ children }: PropsWithChildren<{}>) {
  const graph = useRef(new DirectedGraph<number, ReactorEdge>())
  const nodeEditor = useNodeEditor(graph)
  const edgeEditor = useEdgeEditor(nodeEditor, graph)

  const draggingNodeId = useRef(-1)
  const rerenderListeners = useRef<(() => void)[][]>([])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      draggingNodeId.current = -1

      if (
        edgeEditor.reservedSocket &&
        checkOutsideMouseEvent(e, (dom) => dom.id.includes('socket'))
      ) {
        edgeEditor.cancelConnection()
      }
    },
    [edgeEditor.reservedSocket],
  )

  const update = useCallback((nodeId: number) => {
    rerenderListeners.current[nodeId]?.forEach((cb) => cb())
  }, [])

  const addUpdateListener = useCallback((nodeId: number, cb: () => void) => {
    rerenderListeners.current[nodeId] ??= []
    rerenderListeners.current[nodeId].push(cb)
  }, [])

  const removeUpdateListener = useCallback((nodeId: number, cb: () => void) => {
    rerenderListeners.current[nodeId] = rerenderListeners.current[
      nodeId
    ]?.filter((oldCb) => oldCb !== cb)
  }, [])

  useLayoutEffect(() => {
    addEventListener('mouseup', handleMouseUp)
    return () => removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  return (
    <ReactorVisualContext.Provider
      value={{
        nodeEditor,
        edgeEditor,
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

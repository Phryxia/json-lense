import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { DirectedGraph } from '@src/logic/shared/graph'
import type { ReactorEdge } from './types'
import { useEdgeEditor } from './useEdgeEditor'
import { useMouse } from './useMouse'
import { useNodeEditor } from './useNodeEditor'

type IReactorVisualContext = {
  nodeEditor: ReturnType<typeof useNodeEditor>
  edgeEditor: ReturnType<typeof useEdgeEditor>
  mouse: ReturnType<typeof useMouse>
  draggingNodeId: MutableRefObject<number>
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

export function ReactorVisualProvider({ children }: PropsWithChildren<{}>) {
  const graph = useRef(new DirectedGraph<number, ReactorEdge>())
  const nodeEditor = useNodeEditor(graph)
  const edgeEditor = useEdgeEditor(graph)
  const mouse = useMouse()
  const draggingNodeId = useRef(-1)

  return (
    <ReactorVisualContext.Provider
      value={{
        nodeEditor,
        edgeEditor,
        mouse,
        draggingNodeId,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
}

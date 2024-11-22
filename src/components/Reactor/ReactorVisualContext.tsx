import { createContext, PropsWithChildren, useContext } from 'react'
import { type Pool, usePool } from '@src/logic/shared/usePool'
import type { Dimension } from './types'
import { useEdgeEditor } from './useNodeConnector'
import { useMouse } from './useMouse'

type IReactorVisualContext = {
  dimensionPool: Pool<Dimension>
  edgeEditor: ReturnType<typeof useEdgeEditor>
  mouse: ReturnType<typeof useMouse>
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

export function ReactorVisualProvider({ children }: PropsWithChildren<{}>) {
  const dimensionPool = usePool<Dimension>()
  const edgeEditor = useEdgeEditor()
  const mouse = useMouse()

  return (
    <ReactorVisualContext.Provider
      value={{
        dimensionPool,
        edgeEditor,
        mouse,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
}

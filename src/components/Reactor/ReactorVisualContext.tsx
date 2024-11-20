import { createContext, PropsWithChildren, useContext } from 'react'
import { type Pool, usePool } from '@src/logic/shared/usePool'
import type { Dimension } from './types'
import { useNodeConnector } from './useNodeConnector'
import { useMouse } from './useMouse'

type IReactorVisualContext = {
  dimensionPool: Pool<Dimension>
  connector: ReturnType<typeof useNodeConnector>
  mouse: ReturnType<typeof useMouse>
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

export function ReactorVisualContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const dimensionPool = usePool<Dimension>()
  const connector = useNodeConnector()
  const mouse = useMouse()

  return (
    <ReactorVisualContext.Provider
      value={{
        dimensionPool,
        connector,
        mouse,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
}

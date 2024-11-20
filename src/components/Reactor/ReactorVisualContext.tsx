import { createContext, PropsWithChildren, useContext } from 'react'
import { type Pool, usePool } from '@src/logic/shared/usePool'
import type { Dimension } from './types'
import { useNodeConnector } from './useNodeConnector'

type IReactorVisualContext = {
  dimensionPool: Pool<Dimension>
  connector: ReturnType<typeof useNodeConnector>
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

export function ReactorVisualContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const dimensionPool = usePool<Dimension>()
  const connector = useNodeConnector()

  return (
    <ReactorVisualContext.Provider
      value={{
        dimensionPool,
        connector,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
}

import { createContext, PropsWithChildren, useContext } from 'react'
import { type Pool, usePool } from '@src/logic/shared/usePool'
import type { Dimension } from './types'

type IReactorVisualContext = {
  dimensionPool: Pool<Dimension>
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

export function ReactorVisualContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const dimensionPool = usePool<Dimension>()

  return (
    <ReactorVisualContext.Provider
      value={{
        dimensionPool,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
}

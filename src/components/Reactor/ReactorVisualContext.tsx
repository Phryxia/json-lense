import { createContext, PropsWithChildren, useContext } from 'react'
import type { Dimension } from './types'
import { type Pool, usePool } from '@src/logic/shared/usePool'

type IReactorVisualContext = {
  dimensionPool: Pool<Dimension>
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactorVisual = () => useContext(ReactorVisualContext)

/*
  Some technical notes

  [...arr] is not same to arr.slice()
  The former one coerce empty into undefined
  The latter one preserve empty holes
  DO NOT COERCE EMPTY INTO UNDEFINED (to get better performance)
  Note that iterator coerce empty to undefined

  Also note that in strict mode, rerendering occurs twice.
  Therefore YOU MUST NOT MUTATE stack inside of setState callback.
*/
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

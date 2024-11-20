import { createContext, PropsWithChildren, useState } from 'react'
import type { Reactor } from '@src/model/reactor'

type IReactorModelContext = {}

// @ts-ignore
const ReactorModelContext = createContext<IReactorModelContext>()

export function ReactorModelProvider({ children }: PropsWithChildren<{}>) {
  const [reactors, setReactors] = useState<Reactor[]>([])

  return (
    <ReactorModelContext.Provider value={{}}>
      {children}
    </ReactorModelContext.Provider>
  )
}

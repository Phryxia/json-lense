import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'
import type { ReactorNode, SerializedReactor } from '@src/model/reactor'
import { Serializable } from '@src/model/serializable'
import { createReactor } from '@src/logic/reactor/unite'

type IReactorModelContext = {
  reactors: ReactorNode[]
  schemas: SerializedReactor<Serializable>[]
  add(schema: Omit<SerializedReactor<Serializable>, 'id'>): number
  remove(id: number): void
  update(schema: SerializedReactor<Serializable>): void
}

// @ts-ignore
const ReactorModelContext = createContext<IReactorModelContext>()

export const useReactor = () => useContext(ReactorModelContext)

export function ReactorModelProvider({ children }: PropsWithChildren<{}>) {
  const [reactors, setReactors] = useState<ReactorNode[]>([])
  const [schemas, setSchemas] = useState<SerializedReactor<Serializable>[]>([])

  const add = useCallback(
    (schema: Omit<SerializedReactor<Serializable>, 'id'>) => {
      const instancedSchema = {
        ...schema,
        id: reactors.length,
      }
      setReactors((reactors) => [
        ...reactors,
        {
          id: reactors.length,
          sources: [],
          reactor: createReactor(instancedSchema),
        },
      ])
      setSchemas((schemas) => [...schemas, instancedSchema])
      return reactors.length
    },
    [reactors],
  )

  const remove = useCallback((id: number) => {
    setReactors((reactors) => reactors.filter((reactor) => reactor.id !== id))
    setSchemas((schemas) => schemas.filter((schema) => schema.id !== id))
  }, [])

  const update = useCallback((newSchema: SerializedReactor<Serializable>) => {
    setReactors((reactors) =>
      reactors.map((oldReactor) =>
        newSchema.id === oldReactor.id
          ? {
              id: reactors.length,
              sources: [],
              reactor: createReactor(newSchema),
            }
          : oldReactor,
      ),
    )
    setSchemas((schemas) =>
      schemas.map((oldSchema) =>
        newSchema.id === oldSchema.id ? newSchema : oldSchema,
      ),
    )
  }, [])

  return (
    <ReactorModelContext.Provider
      value={{
        reactors,
        schemas,
        add,
        remove,
        update,
      }}
    >
      {children}
    </ReactorModelContext.Provider>
  )
}

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'
import { nanoid } from 'nanoid/non-secure'
import type {
  ReactorEdge,
  ReactorNode,
  SerializedReactor,
} from '@src/model/reactor'
import type { Serializable } from '@src/model/serializable'
import type { JSONLense } from './types'
import { createReactor } from '@src/logic/reactor/unite'
import { createLenses } from './logic'

type IReactorModelContext = {
  reactors: ReactorNode[]
  schemas: SerializedReactor<Serializable>[]
  add(schema: Omit<SerializedReactor<Serializable>, 'id'>): string
  remove(id: string): void
  update(schema: SerializedReactor<Serializable>): void
  connect(connection: ReactorEdge): void
  disconnect(connection: ReactorEdge): void
  lenses: Record<string, JSONLense>
}

// @ts-ignore
const ReactorModelContext = createContext<IReactorModelContext>()

export const useReactor = () => useContext(ReactorModelContext)

interface Props {}

export function ReactorModelProvider({ children }: PropsWithChildren<Props>) {
  const [reactors, setReactors] = useState<ReactorNode[]>([])
  const [schemas, setSchemas] = useState<SerializedReactor<Serializable>[]>([])
  const [edges, setEdges] = useState<ReactorEdge[]>([])
  const [lenses, setLenses] = useState<Record<string, JSONLense>>({})

  const add = useCallback(
    (schema: Omit<SerializedReactor<Serializable>, 'id'>) => {
      const id = nanoid(8)
      const instancedSchema = {
        ...schema,
        id,
      }
      setReactors((reactors) => [
        ...reactors,
        {
          id,
          sourceIds: [],
          reactor: createReactor(instancedSchema),
        },
      ])
      setSchemas((schemas) => [...schemas, instancedSchema])
      return id
    },
    [reactors],
  )

  const remove = useCallback((id: string) => {
    setReactors((reactors) => reactors.filter((reactor) => reactor.id !== id))
    setSchemas((schemas) => schemas.filter((schema) => schema.id !== id))
    setEdges((edges) =>
      edges.filter((edge) => edge.sourceId !== id && edge.targetId !== id),
    )
  }, [])

  const update = useCallback((newSchema: SerializedReactor<Serializable>) => {
    setReactors((reactors) =>
      reactors.map((oldReactor) =>
        newSchema.id === oldReactor.id
          ? {
              id: newSchema.id,
              sourceIds: oldReactor.sourceIds,
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

  const connect = useCallback((connection: ReactorEdge) => {
    setEdges((edges) => [...edges, connection])
    setReactors((reactors) =>
      reactors.map((reactor) => {
        if (
          connection.targetId !== reactor.id ||
          reactor.sourceIds.includes(connection.sourceId)
        ) {
          return reactor
        }

        return {
          ...reactor,
          sourceIds: [...reactor.sourceIds, connection.sourceId],
        }
      }),
    )
  }, [])

  const disconnect = useCallback((connection: ReactorEdge) => {
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          edge.sourceId !== connection.sourceId ||
          edge.sourceParamIndex !== connection.sourceParamIndex ||
          edge.targetId !== connection.targetId ||
          edge.targetParamIndex !== connection.targetParamIndex,
      ),
    )
    setReactors((reactors) =>
      reactors.map((reactor) => {
        if (
          reactor.id !== connection.targetId ||
          !reactor.sourceIds.includes(connection.sourceId)
        ) {
          return reactor
        }
        return {
          ...reactor,
          sourceIds: reactor.sourceIds.filter(
            (id) => id !== connection.sourceId,
          ),
        }
      }),
    )
  }, [])

  useLayoutEffect(() => {
    setLenses(createLenses(reactors))
  }, [reactors])

  return (
    <ReactorModelContext.Provider
      value={{
        reactors,
        schemas,
        add,
        remove,
        update,
        connect,
        disconnect,
        lenses,
      }}
    >
      {children}
    </ReactorModelContext.Provider>
  )
}

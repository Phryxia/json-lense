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
import { getHyperReactorInnerSocketKey } from '../utils'
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
  finalLense: JSONLense | undefined
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
  const [finalOutputNodeId, setFinalOutputNodeId] = useState('')

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
          sources: [],
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
              sources: oldReactor.sources,
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
          reactor.sources.some(
            ({ id, socketId }) =>
              id === connection.sourceId &&
              socketId === connection.sourceSocketId,
          )
        ) {
          return reactor
        }

        return {
          ...reactor,
          sources: [
            ...reactor.sources,
            {
              id: connection.sourceId,
              socketId: connection.sourceSocketId,
            },
          ],
        }
      }),
    )

    // When targetId is root output, its actual node
    // doesn't exists because it's just visual node id for convenience
    // Therefore, it should be handled separately.
    // Note that input node doesn't required to be handle
    // since every lenses get input explictly.
    if (
      connection.targetId ===
      getHyperReactorInnerSocketKey({
        nodeId: 'root',
        socketType: 'input',
      })
    ) {
      setFinalOutputNodeId(connection.sourceId)
    }
  }, [])

  const disconnect = useCallback((connection: ReactorEdge) => {
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          edge.sourceId !== connection.sourceId ||
          edge.sourceSocketId !== connection.sourceSocketId ||
          edge.targetId !== connection.targetId,
      ),
    )
    setReactors((reactors) =>
      reactors.map((reactor) => {
        if (
          reactor.id !== connection.targetId ||
          !reactor.sources.some(
            ({ id, socketId }) =>
              id === connection.sourceId &&
              socketId === connection.sourceSocketId,
          )
        ) {
          return reactor
        }
        return {
          ...reactor,
          sources: reactor.sources.filter(
            ({ id, socketId }) =>
              id !== connection.sourceId &&
              socketId !== connection.sourceSocketId,
          ),
        }
      }),
    )

    if (
      connection.targetId ===
      getHyperReactorInnerSocketKey({
        nodeId: 'root',
        socketType: 'input',
      })
    ) {
      setFinalOutputNodeId('')
    }
  }, [])

  useLayoutEffect(() => {
    setLenses(createLenses(reactors))
  }, [reactors])

  const finalLense = finalOutputNodeId ? lenses[finalOutputNodeId] : undefined

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
        finalLense,
      }}
    >
      {children}
    </ReactorModelContext.Provider>
  )
}

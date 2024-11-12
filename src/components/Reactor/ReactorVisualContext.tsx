import {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import type { Dimension } from './types'

type IReactorVisualContext = {
  count: number
  dimensions: Dimension[]
  createDimension(size: Partial<Dimension>): {
    dimension: Dimension
    id: number
  }
  updateDimension(
    id: number,
    newSize: Partial<Dimension> | ((oldDim: Dimension) => Partial<Dimension>),
  ): void
  deleteDimension(id: number): void
}

// @ts-ignore
const ReactorVisualContext = createContext<IReactorVisualContext>()

export const useReactor = () => useContext(ReactorVisualContext)

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
  const [dimensions, setDimensions] = useState<Dimension[]>([])

  // to optimize pop & reallocation
  const freeStack = useRef<number[]>([])
  const freeStackTop = useRef<number>(-1)

  // closure tunneling
  const poolSize = useRef<number>(dimensions.length)
  poolSize.current = dimensions.length

  const createDimension = useCallback(
    ({ x = 0, y = 0, w = 100, h = 30 }: Partial<Dimension>) => {
      const newDimension = { x, y, w, h }
      const freeIndex = pop(freeStack, freeStackTop)

      if (freeIndex != null) {
        setDimensions((dims) => {
          const newDims = dims.slice()
          newDims[freeIndex] = newDimension
          return newDims
        })
        return {
          dimension: newDimension,
          id: freeIndex,
        }
      }

      setDimensions((dims) => {
        const newDims = dims.slice()
        newDims.push(newDimension)
        return newDims
      })
      return {
        dimension: newDimension,
        id: poolSize.current++,
      }
    },
    [],
  )

  const deleteDimension = useCallback((id: number) => {
    setDimensions((dims) => {
      const newDims = dims.slice()

      // don't render when there is no such elements
      if (!newDims[id]) return dims
      delete newDims[id]
      return newDims
    })

    push(freeStack, freeStackTop, id)
  }, [])

  const updateDimension = useCallback(
    (
      id: number,
      newDim: Partial<Dimension> | ((oldDim: Dimension) => Partial<Dimension>),
    ) => {
      setDimensions((dims) => {
        if (!dims[id]) return dims

        const newDims = dims.slice()
        const target = (newDims[id] = { ...newDims[id] })

        if (typeof newDim === 'function') {
          newDim = newDim(target)
        }

        for (const changedKey in newDim) {
          // @ts-ignore
          target[changedKey] = newDim[changedKey]
        }
        return newDims
      })
    },
    [],
  )

  return (
    <ReactorVisualContext.Provider
      value={{
        count: dimensions.length - freeStackTop.current - 1,
        dimensions,
        createDimension,
        deleteDimension,
        updateDimension,
      }}
    >
      {children}
    </ReactorVisualContext.Provider>
  )
}

function push<T>(
  stack: MutableRefObject<T[]>,
  top: MutableRefObject<number>,
  el: T,
) {
  stack.current[++top.current] = el
  return el
}

function pop<T>(stack: MutableRefObject<T[]>, top: MutableRefObject<number>) {
  if (top.current < 0) {
    return undefined
  }
  return stack.current[top.current--]
}

import { type MutableRefObject, useCallback, useRef, useState } from 'react'

export type Pool<Element> = ReturnType<typeof usePool<Element>>

export function usePool<Element>() {
  const [elements, setElements] = useState<Element[]>([])

  // to optimize pop & reallocation
  const freeStack = useRef<number[]>([])
  const freeStackTop = useRef<number>(-1)

  // closure tunneling
  const poolSize = useRef<number>(elements.length)
  poolSize.current = elements.length

  const get = useCallback((id: number) => elements[id], [elements])

  const add = useCallback((element: Element) => {
    const newElement = { ...element }
    const freeIndex = pop(freeStack, freeStackTop)

    if (freeIndex != null) {
      setElements((element) => {
        const newDims = element.slice()
        newDims[freeIndex] = newElement
        return newDims
      })
      return {
        element: newElement,
        id: freeIndex,
      }
    }

    setElements((dims) => {
      const newElements = dims.slice()
      newElements.push(newElement)
      return newElements
    })
    return {
      element: newElement,
      id: poolSize.current++,
    }
  }, [])

  const remove = useCallback((id: number) => {
    setElements((dims) => {
      const newElements = dims.slice()

      // don't render when there is no such elements
      if (!newElements[id]) return dims
      delete newElements[id]
      return newElements
    })

    push(freeStack, freeStackTop, id)
  }, [])

  const modify = useCallback(
    (
      id: number,
      newElement: Partial<Element> | ((oldDim: Element) => Partial<Element>),
    ) => {
      setElements((dims) => {
        if (!dims[id]) return dims

        const newElements = dims.slice()
        const target = (newElements[id] = { ...newElements[id] })

        if (typeof newElement === 'function') {
          newElement = newElement(target)
        }

        for (const changedKey in newElement) {
          // @ts-ignore
          target[changedKey] = newElement[changedKey]
        }
        return newElements
      })
    },
    [],
  )

  const count = elements.length - freeStackTop.current - 1

  return {
    elements,
    count,
    get,
    add,
    remove,
    modify,
  }
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

import { useCallback, useRef } from 'react'

type MouseEventHandler = (e: MouseEvent) => void

export function useOutsideClickHandler<T extends HTMLElement>(
  callback: MouseEventHandler,
) {
  const userCallback = useRef<MouseEventHandler>(() => {})
  userCallback.current = callback

  const handlerPair = useRef<MouseEventHandler>(() => {})

  const refInitializer = useCallback((dom: T | null) => {
    if (dom) {
      handlerPair.current = (e: MouseEvent) => {
        if (e.target instanceof Node && !dom.contains(e.target)) {
          userCallback.current(e)
        }
      }
      window.addEventListener('click', handlerPair.current)
    } else {
      window.removeEventListener('click', handlerPair.current)
    }
  }, [])

  return refInitializer
}

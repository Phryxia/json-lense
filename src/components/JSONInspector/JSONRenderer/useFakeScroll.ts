import {
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export function useFakeScroll<M extends HTMLElement, S extends HTMLElement>() {
  const [cursor, setCursor] = useState(0)
  const { lineHeight, measureRef } = useLineHeightMeasure<M>()
  const scrollRef = useFakeScrollPosition<S>(lineHeight, setCursor)

  return {
    cursor,
    setCursor,
    measureRef,
    scrollRef,
    lineHeight,
  }
}

function useLineHeightMeasure<E extends HTMLElement>() {
  const [lineHeight, setLineHeight] = useState<number>()
  const measureRef = useRef<E>(null)

  useLayoutEffect(() => {
    function computeHeight() {
      if (!measureRef.current) return

      const lineHeight = measureRef.current.clientHeight

      setLineHeight(lineHeight)
    }

    computeHeight()
    window.addEventListener('resize', computeHeight)
    return () => window.removeEventListener('resize', computeHeight)
  }, [])

  return {
    lineHeight,
    measureRef,
  }
}

function useFakeScrollPosition<E extends HTMLElement>(
  lineHeight: number | undefined,
  setCursor: Dispatch<SetStateAction<number>>,
) {
  const scrollRef = useRef<E>(null)

  useLayoutEffect(() => {
    if (!scrollRef.current || !lineHeight) return

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLPreElement
      const currentLine = target.scrollTop / lineHeight
      setCursor(currentLine)
    }

    scrollRef.current.addEventListener('scroll', handleScroll)
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll)
  }, [lineHeight])

  return scrollRef
}

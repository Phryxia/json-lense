import { useLayoutEffect, useRef, useState } from 'react'

export function useMouse() {
  const playgroundRef = useRef<HTMLElement>(null)
  const { x, y } = playgroundRef.current?.getBoundingClientRect() ?? {
    x: 0,
    y: 0,
  }

  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)

  useLayoutEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setMouseX(e.pageX)
      setMouseY(e.pageY)
    }

    addEventListener('mousemove', handleMouseMove)
    return () => removeEventListener('mousemove', handleMouseMove)
  }, [])

  return {
    x: mouseX - x,
    y: mouseY - y,
    playgroundRef,
  }
}

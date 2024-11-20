import { useLayoutEffect, useRef, useState } from 'react'

export function useMouse() {
  const editorRef = useRef<HTMLElement>(null)

  const { x, y } = editorRef.current?.getBoundingClientRect() ?? { x: 0, y: 0 }

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
    editorRef,
    mouseX: mouseX - x,
    mouseY: mouseY - y,
  }
}
